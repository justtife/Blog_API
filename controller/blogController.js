const Article = require("../models/Article");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/User");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Subscriber = require("../models/Subscriber");
const refreshTokenOnRequest = require("../utils/refreshToken");
const cloudinary = require("cloudinary").v2;
const {
  checkPermission,
  allowAccessToRead,
} = require("../middlewares/authorization");
const { reminderMail } = require("../utils/Emails");
module.exports = class BlogAPI {
  //Create Article
  static async createArticle(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res });
    const { title, description, tags, content, state } = req.body;
    let coverImage;
    const checkTitle = await Article.findOne({ title });
    if (checkTitle) {
      throw new CustomError.BadRequestError(
        `Article with title ${title} exists, please change title`
      );
    }
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        use_filename: true,
        folder: "article_coverImages",
      });
      coverImage = result.public_id + " " + result.url;
    } else {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    //Calculate Average Reading Time
    //Average Reading time is 238words per minute
    const numOfWords = content.split(" ").length;
    let wordsperminute = 238;
    let reading_time = Math.ceil(numOfWords / wordsperminute);
    let author = req.user._id;
    //Save article to database
    const articleData = {
      title,
      description,
      tags,
      content,
      reading_time,
      author,
      state,
      coverImage,
    };
    //Create Article
    const article = await Article.create(articleData);
    //Check Subscribers
    const followers = await Subscriber.find({ author: req.user._id }).populate({
      path: "follower",
      select: "email name",
    });
    if (article.state === "publish") {
      //Send mail to subscribed users
      await reminderMail({
        name: followers[0].follower[0].name.first,
        email: followers[0].follower[0].email,
        title,
        description,
        image: coverImage.split(" ")[1],
        author: article.author,
        article: article._id.toString(),
      });
    }
    res.status(StatusCodes.CREATED).json({
      message: {
        detail: "Article created successfully",
        status: "Success",
        article: _.omit(Object.values(article)[1], ["__v", "updatedAt"]),
      },
    });
  }
  //List of Authors article
  static async myArticles(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res });
    //Query articles by state
    const { state } = req.query;
    let article = Article.find({ author: req.user._id });
    if (!article) {
      throw new CustomError.NotFoundError("No article was found");
    }
    //Count numbers of articles
    let articleLength = await Article.find({
      author: req.user._id,
    }).countDocuments();
    if (state) {
      article = article.find({ state });
    }
    //Paginate articles by a limit of ten articles per page
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * 10;

    let result = article.skip(skip).limit(10);

    const articles = await result;
    res.status(StatusCodes.OK).json({
      message: {
        detail: `User:${req.user._id} Articles`,
        //Number of articles per page
        countPerPage: articles.length,
        //Total number of articles
        numOfArticles: articleLength,
        status: "Success",
        articles,
      },
    });
  }
  // Single Article
  static async readSingleArticle(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res });
    //Get article by id
    const { id: bookID } = req.params;
    let article = await Article.findOne({
      _id: bookID,
    })
      //populate article by author and comments
      .populate({ path: "user", select: "name email image" })
      .populate({
        path: "comments",
        select: "-createdAt -updatedAt -__v",
      })
      .select("-updatedAt -__v");
    //Check if the article is locked
    //If it locked, check if user has prmission to read
    allowAccessToRead(article, req.user);
    //Check if the article is in draft mode
    if (article.state === "draft") {
      checkPermission(req.user, article.author);
    } else {
      //Increment read count by one
      article.read_count += 1;
    }
    article.save();
    res.status(StatusCodes.OK).json({
      message: {
        detail: `Article with id:${bookID}`,
        status: "Success",
        article,
      },
    });
  }
  //Get all articles
  static async allArticles(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res });
    const { search, read_count, reading_time, createdAt } = req.query;
    //Find Published Articles and populate with Author's Details
    let query = {};
    if (req.user.role === "user") {
      query.state = "publish";
    }
    let publishedArticle = Article.find(query)
      .populate({
        path: "user",
        select: "name email",
      })
      .select("-updatedAt -__v -locked");
    //Count Number of Published Articles
    const numOfArticles = await Article.find({
      state: "publish",
    }).countDocuments();
    if (search) {
      publishedArticle = publishedArticle.find({
        $or: [
          //Search by author's name,email
          // { "user.email": { $regex: search, $options: "i" } },
          //{ "user.email": { $regex: search, $options: "i" } },
          // Search by title of article
          { title: { $regex: search, $options: "i" } },
          //Search by keywords in tags
          { tags: { $regex: search, $options: "i" } },
        ],
      });
    }
    //Order by read_count
    if (read_count) {
      // Descending Order
      if (read_count == "-1") {
        publishedArticle.sort("-read_count");
      }
      //Ascending Order
      else {
        publishedArticle.sort("read_count");
      }
    }
    //Order by reading time
    if (reading_time) {
      // Descending Order
      if (reading_time == "-1") {
        publishedArticle.sort("-reading_time");
      }
      // Ascending Order
      else {
        publishedArticle.sort("reading_time");
      }
    }
    //Order by timestamp {Date created}
    if (createdAt) {
      // Descending Order
      if (createdAt == "-1") {
        publishedArticle.sort("-createdAt");
      }
      // Ascending Order
      else {
        publishedArticle.sort("createdAt");
      }
    }
    //Paginate all articles created by 20 articles per page
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * 20;

    let data = publishedArticle.skip(skip).limit(20);
    const output = await data;
    res.status(200).json({
      message: {
        detail: "All Articles",
        status: "Success",
        countPerPage: output.length,
        numOfPubArticles: numOfArticles,
        articles: output,
      },
    });
  }
  //Update/Publish article
  static async updateArticle(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res });
    const { id: bookID } = req.params;
    let article = await Article.findById({ _id: bookID });
    if (!article) {
      throw new CustomError.NotFoundError(
        `Article with id:${bookID} deos not exist`
      );
    }
    checkPermission(req.user, article.author);
    //Check if article has been published already
    if (article.state == "publish") {
      return res.status(StatusCodes.OK).json({
        message: {
          detail: "Article has been published already",
          status: "success",
        },
      });
    }
    article.state = "publish";
    await article.save();
    //Check Subscribers
    const followers = await Subscriber.find({ author: req.user._id }).populate({
      path: "follower",
      select: "email name",
    });
    await reminderMail({
      name: followers[0].follower[0].name.first,
      email: followers[0].follower[0].email,
      title: article.title,
      description: article.description,
      image: article.coverImage.split(" ")[1],
      author: article.author,
      article: article._id.toString(),
    });
    res.status(StatusCodes.OK).json({
      message: {
        detail: "Article has been published",
        status: "success",
        article: _.omit(Object.values(article)[2], [
          "updatedAt",
          "__v",
          "locked",
        ]),
      },
    });
  }
  //Edit Article
  static async editArticle(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res, user: req.user });
    const { id: bookID } = req.params;
    const { title, description, tags, content } = req.body;
    if (!bookID || !title || !description || !content) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    const checkTitle = await Article.findOne({
      $and: [{ _id: { $ne: bookID } }, { title }],
    });
    //if a new title if passed to the body,
    //Check if the title exist in other articles to prevent duplicate
    if (checkTitle) {
      throw new CustomError.BadRequestError(
        "Title already exist, please use another title"
      );
    }
    let article = await Article.findById({ _id: bookID });
    checkPermission(req.user, article.author);
    //Calculate new reading time
    const numOfWords = content.split(" ").length;
    var wordsperminute = 238;
    var reading_time = Math.ceil(numOfWords / wordsperminute);
    //Save Article
    article.title = title;
    article.description = description;
    article.tags = tags;
    article.content = content;
    article.reading_time = reading_time;
    await article.save();
    res.status(StatusCodes.OK).json({
      message: {
        detail: "Article successfully updated",
        status: "Success",
        article: _.omit(Object.values(article)[2], [
          "updatedAt",
          "__v",
          "locked",
        ]),
      },
    });
  }
  //Lock Article
  static async lockArticle(req, res) {
    const { lock } = req.body;
    const { id: articleId } = req.params;
    if (lock !== true && lock !== false) {
      throw new CustomError.BadRequestError("Invalid Entry");
    }
    const article = await Article.findOne({ state: "publish", _id: articleId });
    if (!article) {
      throw new CustomError.NotFoundError("Invalid Article");
    }
    article.locked = lock;
    await article.save();
    res.status(StatusCodes.OK).json({
      message: {
        details: "Article Updated",
        locked: lock,
        status: "Success",
      },
    });
  }
  //Delete Article
  static async deleteArticle(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res, user: req.user });
    const { id: bookID } = req.params;
    let article = await Article.findById({ _id: bookID });
    checkPermission(req.user, article.author);
    await article.remove();
    //Send mail to user
    res.status(StatusCodes.OK).json({
      message: { detail: "Article successfully Deleted", status: "Success" },
    });
  }
};
