const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
      },
      last: {
        type: String,
      },
      user: {
        type: String,
      },
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: {
        values: ["owner", "admin", "user"],
        message: "{VALUE} is not supported",
      },
      default: "user",
    },
    position: {
      type: String,
    },
    enable: {
      type: Boolean,
      default: true,
    },
    flagged: {
      type: Boolean,
      default: false,
    },
    strategy: {
      type: Array,
    },
    subscribed: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);
// Hash Password before saving on every modification of the password
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
//Method to compare password
UserSchema.methods.comparePassword = async function (passcode) {
  const isValid = await bcrypt.compare(passcode, this.password);
  return isValid;
};

module.exports = mongoose.model("User", UserSchema);
