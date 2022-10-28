const Article = require("../models/Article");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/User");
const { ObjectId } = require("mongoose");
module.exports = class BlogAPI {
  static async createArticle(req, res) {
    const { title, description, tags, body } = req.body;
    if (!title || !description || !body) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    const numOfWords = body.split(" ").length;
    var wordsperminute = 238;
    var reading_time = Math.ceil(numOfWords / wordsperminute).toString() + "m";
    let author = req.user._id;
    const articleData = {
      title,
      description,
      tags,
      body,
      reading_time,
      author,
    };
    await Article.create(articleData);
    let numOfArticle = await Article.findOne({
      author: req.user._id,
    }).count();
    if (numOfArticle === 20) {
      let authorDetail = await User.findById({ _id: req.user._id });
      authorDetail.isVerified = true;
      await authorDetail.save();
    }
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Article created successfully" });
  }
  static async readSingleArticle(req, res) {
    const { id: bookID } = req.params;
    let article = await Article.findById({
    //   _id: mongoose.Types.ObjectId(bookID),
    }).populate("comments");
    article.read_count += 1;
    article.save();
    res.status(StatusCodes.OK).json({ Article: article });
  }
  static async myArticles(req, res) {
    console.log(req.user);
    const article = await Article.find({ author: ObjectId(req.user._id) });
    console.log(article);
    if (!article) {
      throw new CustomError.NotFoundError("You have no blog yet");
    }
    res.status(StatusCodes.OK).json({ article });
  }
  static async allArticles(req, res) {
    const { search, status, jobType, sort } = req.query;

    if (search) {
      var result = Article.find({
        $or: [
          { author: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { tag: { $regex: search, $options: "i" } },
        ],
      });
    }

    // if (sort === "read_count") {
    //   result = result.sort("read_count");
    // }
    // if (sort === "reading_time") {
    //   result = result.sort("reading_time");
    // }
    // const page = Number(req.query.page) || 1;
    // const skip = (page - 1) * 20;

    // result = result.skip(skip).limit(20);
    const article = await result;

    console.log(article);
  }
  static async updateArticle(req, res) {
    const { id: bookID } = req.params;
    const { title, description, state, tags, body } = req.body;
    if (!bookID || !title || !description || !state || !body) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    let article = await Article.findById({ _id: bookID });

    article.title = title;
    article.description = description;
    article.state = state;
    article.tags = tags;
    article.body = body;
    await article.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "Article successfully updated" });
  }
  static async deleteArticle(req, res) {
    const { id: bookID } = req.params;
    const { securityQuestion } = req.body;
    let article = await Article.findById({ _id: bookID });
    const author = await User.findById({ _id: req.user._id });
    const isSecurityQuestion = author.securityQuestion == securityQuestion;
    if (!isSecurityQuestion) {
      throw new CustomError.UnAuthorizedError("Incorrect Security Question");
    }
    await article.remove();
    let numOfArticle = await Article.findOne({
      author: req.user._id,
    }).count();
    if (numOfArticle < 20) {
      let authorDetail = await User.findById({ _id: req.user._id });
      authorDetail.isVerified = false;
      await authorDetail.save();
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Article successfully Deleted" });
  }
};
