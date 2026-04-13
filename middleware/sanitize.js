const mongoSanitize = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/$/g, '').replace(/./g, '');
      }
    }
  }
  next();
};

module.exports = { mongoSanitize };