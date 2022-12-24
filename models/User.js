const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
    },
    last: {
      type: String,
    },
    user: {
      type: String,
      unique: [true, 'Username exists already, please enter a new one'],
    },
  },
  email: {
    type: String,
    unique: [true, "This email already exists, please enter a new one"],
  },
  password: {
    type: String,
  },
  image: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  subscribers:{
    type: Array,
  },
  securityQuestion: {
    type: String,
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
