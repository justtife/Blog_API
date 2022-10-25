const Article = require("../models/Article");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
module.exports = class BlogAPI {
  static async createArticle(req, res) {
    const { title, description, tags, body } = req.body;
    const numOfWords = body.split(" ").length;
    var wordsperminute = 233;
    var reading_time = Math.ceil(numOfWords / wordsperminute);
    const articleData = {
      title,
      description,
      tags,
      body,
      reading_time,
    };
    await Article.create(articleData);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Article created successfully" });
  }
  static async readSingleArticle(req, res) {
    const { id: bookID } = req.params;
    let article = await Article.findById(bookID);
    if (!article) {
      throw new CustomError.NotFoundError(
        `Article with id:${bookID} does not exist`
      );
    }
    article.read_count += 1;
    article.save();
    res.status(StatusCodes.OK).json({ Article: article });
  }
  static async allArticles(req, res) {
    const { search, status, jobType, sort } = req.query;

    const queryObject = {
      createdBy: req.user.userId,
    };

    if (search) {
      queryObject.author = { $regex: search, $options: "i" };
    }
    let result = Job.find(queryObject);

    if (sort === "read_count") {
      result = result.sort("read_count");
    }
    if (sort === "reading_time") {
      result = result.sort("reading_time");
    }
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * 20;

    result = result.skip(skip).limit(20);

    const article = await result;
  }
};
