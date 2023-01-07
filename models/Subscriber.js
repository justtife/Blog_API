const mongoose = require("mongoose");
const SubscriberSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: true,
    },
    subscriber: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
SubscriberSchema.virtual("following", {
  ref: "User",
  localField: "author",
  foreignField: "_id",
  justOne: false,
});
SubscriberSchema.virtual("follower", {
  ref: "User",
  localField: "subscriber",
  foreignField: "_id",
  justOne: false,
});
module.exports = mongoose.model("Subscriber", SubscriberSchema);
