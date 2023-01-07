const Subscriber = require("../models/Subscriber");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
module.exports = class Subscribe {
  static async subscribe(req, res) {
    const { id: authorID } = req.params;
    if (!authorID) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    const author = await User.findOne({ id: authorID });
    if (!author) {
      throw CustomError.NotFoundError("Author with this ID does not exist");
    }
    if (author.enable === false || author.flagged === true) {
      throw new CustomError.BadRequestError("Cannot follow user");
    }
    if (req.user._id.toString() === authorID.toString()) {
      throw new CustomError.BadRequestError(
        "You cannot subscribe to your account"
      );
    }
    const checkUser = await Subscriber.findOne({
      $and: [{ author: authorID }, { subscriber: req.user._id }],
    });
    if (checkUser) {
      throw new CustomError.BadRequestError("You are already subscribed");
    }
    const subscribe = { author: authorID, subscriber: req.user._id };
    await Subscriber.create(subscribe);
    res.status(StatusCodes.OK).json({
      message: { details: "Subscribe successful", status: "Success" },
    });
  }
  static async unsubscribe(req, res) {
    const { id: authorID } = req.params;
    if (!authorID) {
      throw new CustomError.BadRequestError("Invalid Request");
    }
    const checkSubscriber = await Subscriber.findOne({
      $and: [{ author: authorID }, { subscriber: req.user._id }],
    });
    if (!checkSubscriber) {
      throw new CustomError.BadRequestError(
        "You are not subscribed to this author"
      );
    }
    await checkSubscriber.remove();
    res.status(StatusCodes.OK).json({
      message: { detail: "Unsubscribe successful", status: "Success" },
    });
  }
  static async checkUserSub(req, res) {
    const authorSub = await Subscriber.find({
      subscriber: req.user._id,
    })
      .populate({ path: "following", select: "name email" })
      .select("-__v -updatedAt");
    if (!authorSub) {
      throw new CustomError.NotFoundError(
        "You have not subscribed to any author"
      );
    }
    res.status(StatusCodes.OK).json({
      message: {
        detail: "List of users you follow",
        author: authorSub,
        status: "Success",
      },
    });
  }
  static async followers(req, res) {
    const followers = await Subscriber.find({ author: req.user._id })
      .populate({
        path: "follower",
        select: "name email",
      })
      .select("-updatedAt -__v");
    res.status(StatusCodes.OK).json({
      message: {
        detail: "List of users following you",
        user: followers,
        status: "Success",
      },
    });
  }
};
