const Article = require("../models/Article");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/User");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const refreshTokenOnRequest = require("../utils/refreshToken");
module.exports = class BlogAPI {
  //Create Article
  static async createArticle(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res, user: req.user });
    const { title, description, tags, body } = req.body;
    if (!title || !description || !body) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    //Calculate Average Reading Time
    //Average Reading time is 238words per minute
    const numOfWords = body.split(" ").length;
    var wordsperminute = 238;
    var reading_time = Math.ceil(numOfWords / wordsperminute);
    let author = req.user._id;
    const articleData = {
      title,
      description,
      tags: [tags],
      body,
      reading_time,
      author,
    };
    //Create Article
    const article = await Article.create(articleData);
    //Count  the number of article published by the author
    let numOfArticle = await Article.findOne({
      author: req.user._id,
      state: "Published",
    }).count();
    //Verify author if numbers of articles published is upto 20
    if (numOfArticle >= 20) {
      let authorDetail = await User.findById({ _id: req.user._id });
      //Make author verified
      authorDetail.isVerified = true;
      await authorDetail.save();
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
    await refreshTokenOnRequest({ req, res, user: req.user });
    //Query articles by state
    const { state } = req.query;
    let article = Article.find({ author: req.user._id });
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
    await refreshTokenOnRequest({ req, res, user: req.user });
    //Get article by id
    const { id: bookID } = req.params;
    let article = await Article.findById({
      _id: bookID,
    })
      //populate article by author and comments
      .populate({ path: "user", select: "-securityQuestion -password -__v" })
      .populate({
        path: "comments",
        select: "-createdAt -updatedAt -__v",
      })
      .select("-updatedAt");
    //Increment read count by one
    article.read_count += 1;
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
    await refreshTokenOnRequest({ req, res, user: req.user });
    const { search, read_count, reading_time, createdAt } = req.query;
    //Find Published Articles and populate with Author's Details
    let publishedArticle = Article.find({ state: "Published" })
      .populate({
        path: "user",
        select: "name email",
      })
      .select("-updatedAt -__v");
    console.log(publishedArticle);
    //Count Number of Published Articles
    const numOfArticles = await Article.find({
      state: "Published",
    }).countDocuments();
    if (search) {
      publishedArticle = publishedArticle.find({
        $or: [
          //Search by author's name,email
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
        numOfArticles,
        articles: output,
      },
    });
  }
  //Update/Publish article
  static async updateArticle(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res, user: req.user });
    const { id: bookID } = req.params;
    let article = await Article.findById({ _id: bookID });
    if (!article) {
      throw new CustomError.NotFoundError(
        `Article with id:${bookID} deos not exist`
      );
    }
    //Check if article has been published already
    if (article.state == "Published") {
      return res.status(StatusCodes.OK).json({
        message: {
          detail: "Article has been published already",
          status: "success",
        },
      });
    }
    article.state = "Published";
    await article.save();
    res.status(StatusCodes.OK).json({
      message: {
        detail: "Article has been published",
        status: "success",
        article: _.omit(Object.values(article)[2], ["updatedAt", "__v"]),
      },
    });
  }
  //Edit Article
  static async editArticle(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res, user: req.user });
    const { id: bookID } = req.params;
    const { title, description, tags, body } = req.body;
    if (!bookID || !title || !description || !body) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    let article = await Article.findById({ _id: bookID });
    //Calculate new reading time
    const numOfWords = body.split(" ").length;
    var wordsperminute = 238;
    var reading_time = Math.ceil(numOfWords / wordsperminute);
    //Save Article
    article.title = title;
    article.description = description;
    article.tags = [tags];
    article.body = body;
    article.reading_time = reading_time;
    await article.save();
    res.status(StatusCodes.OK).json({
      message: {
        detail: "Article successfully updated",
        status: "Success",
        article: _.omit(Object.values(article)[2], ["updatedAt", "__v"]),
      },
    });
  }
  //Delete Article
  static async deleteArticle(req, res) {
    //Refreshes Token on request if user is logged In
    await refreshTokenOnRequest({ req, res, user: req.user });
    const { id: bookID } = req.params;
    const { securityQuestion } = req.body;
    let article = await Article.findById({ _id: bookID });
    const author = await User.findById({ _id: req.user._id });
    //Check if security Question is Correct
    const isSecurityQuestion = await bcrypt.compare(
      securityQuestion,
      author.securityQuestion
    );
    if (!isSecurityQuestion) {
      throw new CustomError.UnAuthorizedError("Incorrect Security Question");
    }
    await article.remove();
    //Count the numbers of articles published by the author
    let numOfArticle = await Article.findOne({
      author: req.user._id,
    }).count();
    //If less than 20 set author's verification to false
    if (numOfArticle < 20) {
      author.isVerified = false;
      await author.save();
    }
    res.status(StatusCodes.OK).json({
      message: { detail: "Article successfully Deleted", status: "Success" },
    });
  }
};
