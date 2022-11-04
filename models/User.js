const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      trim: true,
      minlength: [3, "Firstname Field should contain more than 2 characters"],
      required: [true, "Firstname is required"],
    },
    last: {
      type: String,
      trim: true,
      minlength: [3, "Lastname Field should contain more than 2 characters"],
      required: [true, "Lastname is required"],
    },
  },
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email",
    },
    required: [true, "Email field is required"],
    unique: [true, "This email already exists, please enter a new one"],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Password is required"],
    minlength: [6, "Password length should e more than 5 characters"],
  },
  image: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  securityQuestion: {
    type: String,
    trim: true,
    required: [true, "Security Question field is required"],
    minlength: [3, "Security Question should be longer than 2 characters"],
  },
});
// Hash Password before saving on every modification of the password
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
//Hash Security Question before saving on every modification of the security Question
UserSchema.pre("save", async function () {
  if (!this.isModified("securityQuestion")) return;
  let salt = await bcrypt.genSalt(10);
  this.securityQuestion = await bcrypt.hash(this.securityQuestion, salt);
});
//Method to compare password
UserSchema.methods.comparePassword = async function (passcode) {
  const isValid = await bcrypt.compare(passcode, this.password);
  return isValid;
};

module.exports = mongoose.model("User", UserSchema);
