//Inherit From Error class
class CustomError extends Error {
  constructor(message) {
    super(message);
  }
}
module.exports = CustomError;
