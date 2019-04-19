# ServerLess-Url-Shortner API
Exposes two AWS LambdaAPI that consumes an AWS DynamoDB instance to shorten URLs

Start with installing 'aws cli' to configure AWS credentials.
once AWS is configured , do 
>npm install
>sls deploy

Shorten [Post] Api JSON template:
Request Body = {
  "url":"www.example.com"
}

Response Body = {
  "shortened" : "Awsmj&1"
}



Retreive [GET] Api JSON template:

Request Url
https://www.endpoint-url-string/retreive?url="hashhere" 

Response Body = {
  "fullUrl" : "www.example.com"
}

