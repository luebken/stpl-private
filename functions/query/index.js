'use strict';

const https = require('https');
const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const LIBRARIES_IO_API_KEY = process.env.LIBRARIES_IO_API_KEY
const VERSIONEYE_API_KEY = process.env.VERSIONEYE_API_KEY

// Query and store a component in S3 /query/{ecosystem}/{package}
exports.handle = (event, context, callback) => {

    let ecosystem
    let pkg
    if (event.Records[0]) { //trigger via sns
        var message = event.Records[0].Sns.Message;
        console.log('Message received from SNS:', message);
        var msg = JSON.parse(message)
        ecosystem = msg.ecosystem
        pkg = msg.package
    } else { //trigger via http
        ecosystem = event.pathParameters.ecosystem.toLowerCase()
        pkg = event.pathParameters.package.toLowerCase()
    }

    queryLibrariesIo(ecosystem, pkg, (err, librariosio_result) => {

        const s3 = new AWS.S3();

        const key = "librariosio/" + librariosio_result.platform.toLowerCase() + "/" + librariosio_result.name.toLowerCase()
        var buf = new Buffer.from(JSON.stringify(librariosio_result));

        var params = {
            Bucket: 'stpl-data',
            Key: key,
            ContentType: "application/json",
            ACL: 'public-read',
            Body: buf
        };

        s3.putObject(params, function (err, data) {
            if (err) {
                console.log('Error from s3.putObject: ' + err + ' data:' + data)
            }
            console.log('Data from s3.putObject: ' + data);

            // create a response
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Stored in S3",
                    s3data: data,
                })
            };
            callback(null, response);
        });

    });
}

var queryLibrariesIo = (ecosystem, pkg, callback) => {
    const url = 'https://libraries.io/api/' + ecosystem + '/' + encodeURIComponent(pkg) + '?api_key=' + LIBRARIES_IO_API_KEY
    httpsGet(url, callback)
}

var queryVersionEye = (ecosystem, pkg, callback) => {

    //  https://www.versioneye.com/api/v2/products/java/commons-collections%3Acommons-collections?api_key=a51120d479512bed0044
    if (ecosystem == 'maven') { //versioneye uses java as an ecosystem
        ecosystem = 'java'
    }

    const url = 'https://www.versioneye.com/api/v2/products/' + ecosystem + '/' + encodeURIComponent(pkg) + '?api_key=' + VERSIONEYE_API_KEY
    httpsGet(url, callback)
}

var httpsGet = (url, callback) => {
    console.log('Querying: ' + url)
    https.get(url, (response) => {
        const statusCode = response.statusCode;
        const contentType = response.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error(`Request Failed.\nStatus Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`);
        }
        if (error) {
            console.log("Error for https.get of: " + url)
            console.log("Error message: " + error.message)
            response.resume();
            return;
        }

        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', (chunk) => rawData += chunk);
        response.on('end', () => {
            let parsedData
            try {
                parsedData = JSON.parse(rawData);
            } catch (e) {
                console.log("error parsing " + rawData + "\nmsg:" + e.message);
            }
            callback(null, parsedData);
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });
}


/*
  const params = {
      TableName: process.env.DYNAMODB_TABLE_LIBRARIESIO,
      Item: librariosio_result,
    };

    dynamoDb.put(params, (error) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t create the item.'));
        return;
      }
*/