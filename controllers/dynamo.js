const AWS = require('aws-sdk');

let documentClient = new AWS.DynamoDB.DocumentClient({
    'region': 'us-east-1'
});

module.exports.write =  function (key , value, callback) {
    var params = {
        Item : {
            id: key,
            fullUrl: value 
        },
        TableName: 'records'
    };
    documentClient.put(params,function (err, data){
        if(err){
            console.log("error happened");
            callback(err);
        }
        else{
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    shortened: params.Item.id,
                }),
            };
            callback(null , response);
            console.log("Successfully persisted , ",params);
        }
    });
}



module.exports.retreive =  function ( value, callback) {
    console.log(value)
    var params = {
        Key : {
            id:value, 
        },
        TableName: 'records'
    };

    documentClient.get(params,function (err, data){
        if(err){
            console.log(err);
            callback(err);
        }
        else{
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    fullUrl: data.Item.fullUrl,
                }),
            };
            callback(null , response);
            console.log("Successfully retreived , ",data);
        }
    });
}