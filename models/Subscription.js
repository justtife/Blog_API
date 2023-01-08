const mongoose = require("mongoose");
const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Article",
    required: [true, "This field is required"],
  },
  plan: {
    type: String,
    enum: {
      values: ["monthly", "quarterly", "yearly"],
      message: "{VALUE} is not supported",
    },
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  valid: {
    type: Boolean,
    default: true,
  },
  paymentMethod: {
    type: Array,
    required: true,
  },
  paymentToken: {
    type: Array,
    required: true,
  },
  reminderMail: {
    type: String,
    enum: {
      values: ["sent", "not_sent"],
      message: "{VALUE} is not supported",
    },
    default: "not_sent"
  },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
