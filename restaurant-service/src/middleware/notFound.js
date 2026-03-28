const notFound = (req, res, next) => {
  res.status(404);
  res.json({ message: `Route ${req.originalUrl} not found` });
};

module.exports = notFound;
