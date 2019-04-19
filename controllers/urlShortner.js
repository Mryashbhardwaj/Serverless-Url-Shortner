const crypto = require('crypto');
const dynamo = require('./dynamo');

const getHash = function (url,attempt=0) {
    const hash = crypto.createHash('md5')
                            .update(url)
                            .digest('base64')
                            .replace(/\//g, '_')
                            .replace(/\+/g, '-');
    return hash.substring(0+attempt,7+attempt);
}

module.exports={
    shorten : function (event, callback) {
        let body = JSON.parse(event.body)
        dynamo.write(getHash(body.url),body.url,callback )        
    },
    retrieve : function (event ,callback){
        dynamo.retreive(event.queryStringParameters.url,callback )
    }
} 