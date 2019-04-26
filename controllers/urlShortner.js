const db = require("../helpers/db");
const crypto = require("crypto");
const logger = require('../helpers/logger')

var RETRIES = 10; // in case of collisions new hash generation requires limit

const genHash = function (url, attempt = 0) {
	const hash = crypto
		.createHash("md5")
		.update(url.toString())
		.digest("base64")
		.replace(/\//g, "_")
		.replace(/\+/g, "-");
	return hash.substring(0 + attempt, 7 + attempt);
};

Promise.hashColisonRetry = function (fn, url, times) {
	return new Promise(function (resolve, reject) {
		var error;
		var attempt = function (url) {
			if (times == 0) {
				//  to limit the no of iterations
				reject(error);
			} else {
				fn(genHash(url, RETRIES - times), url)
					.then(resolve)
					.catch(function (e) {
						logger('info', 'Collision detected');
						times--;
						error = e;
						logger('verbose', "Retrying with a new HASH");
						attempt(url);
					});
			}
		};
		attempt(url);
	});
};

module.exports = {
	shorten: function (event, callback) {
		let body = JSON.parse(event.body);
		Promise.hashColisonRetry(db.writeShortUrl /*db Handler*/ , body.url,
				RETRIES /*max retries*/ )
			.then(resp => {
				callback(null, {
					statusCode: 200,
					body: JSON.stringify({
						shorturl: resp.dataValues.shorturl
					})
				});
			})
			.catch(err => {
				logger('error', 'ERROR' /*message*/ , err /*details*/ );
				if (err.hasOwnProperty("msg") && err.msg.indexof("collision") != -1) {
					// Ultimate colision case collision case
					callback(null, {
						statusCode: 500,
						body: "[ PANIC ] Could not resolve unique hash"
					});
				}
				callback(null, {
					statusCode: 500,
					body: JSON.stringify("internal server error")
				});
			}); //Catch ends
	},

	retrieve: function (event, callback) {
		db.retreiveFullUrl(event.queryStringParameters.url, callback);
	}
};