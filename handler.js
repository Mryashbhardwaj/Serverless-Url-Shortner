const shortener = require('./controllers/urlShortner');

module.exports.shorten = (event, context, callback) => {
  shortener.shorten(event, callback);
};

module.exports.retreive = (event, context, callback) => {
  shortener.retrieve(event, callback);
};
