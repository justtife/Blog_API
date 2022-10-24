const notFound = (req, res) => {
  res.json({ message: "Route does not exist" });
};
module.exports = notFound;
