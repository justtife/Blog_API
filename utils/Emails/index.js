const welcome = require("./welcome");
const createPassword = require("./createPassword");
const passwordChangedMail = require("./passwordChanged");
const goodbyeMail = require("./goodbyeMail");
const flagAccountMail = require("./flagAccount");
const unflagAccountMail = require("./unflagAccount");
const reminderMail = require("./publishReminder");
module.exports = {
  welcome,
  createPassword,
  passwordChangedMail,
  goodbyeMail,
  flagAccountMail,
  unflagAccountMail,
  reminderMail,
};
