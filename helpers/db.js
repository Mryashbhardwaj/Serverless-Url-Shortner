const Sequelize = require("sequelize");
const models = require("../models");
const logger = require('./logger')

module.exports.writeShortUrl = function (shorturl, fullurl) {
  return new Promise(function (resolve, reject) {
    models.urlmapings.create({
        shorturl,
        fullurl
      })
      .then(newMapping => {
        logger("info", "Shortened URL '" + fullurl + "' -> " +
          shorturl);
        resolve(newMapping);
      })
      .catch(error => {
        if (error.name === "SequelizeUniqueConstraintError") {
          logger("warn",
            'SequelizeUniqueConstraintError', /*message*/ {
              detail: "UniqueConstraintError for URL = '" + fullurl +
                "'",
            } /*details*/
          );
          logger("verbose", "Searching for existing urls");
          models.urlmapings
            .findOne({
              where: {
                shorturl: shorturl
              }
            })
            .then(found => {
              if (found.fullurl === fullurl) {
                logger('info', new String("Found URL= '" + fullurl +
                  "' Already existing "));
                resolve(found);
              } else {
                reject(
                  new Error({
                    msg: "Counld match a hash collision with FullURL" +
                      ". Probabbly looking at a collision",
                    error
                  }));
              }
            });
        } else {
          reject(new Error(error));
        }
      }); // catch ends
  }); // promise ends
}; // DB write ends

module.exports.retreiveFullUrl = function (value, callback) {
  models.urlmapings.findOne({
      where: {
        shorturl: value
      }
    })
    .then(function (mapping) {
      if (mapping !== null)
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            fullurl: mapping.fullurl
          })
        });
      else {
        callback(null, {
          statusCode: 400,
          body: JSON.stringify("UrlMapping for '" + value +
            "' not found")
        });
      }
    });
};