"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  let data = null;

  try {
    data = JSON.parse(event.body);
  } catch {
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "true",
        request: event.body,
      }),
    });
    return;
  }

  // validation
  if (typeof data.option !== "string") {
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't update the todo item.",
    });
    return;
  }

  const get_params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(get_params, function (error, response) {
    if (error) {
      console.log("Error", error);
    } else {
      console.log("Success", response.Item.options);
      let myItem = response.Item;

      for (let i = 0; i < myItem.options.length; i++) {
        if (myItem.options[i].id === data.option) {
          myItem.options[i].votes += 1;
        }
      }

      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          id: event.pathParameters.id,
        },
        ExpressionAttributeNames: {
          "#options_dict": "options",
        },
        ExpressionAttributeValues: {
          ":options": myItem.options,
        },
        UpdateExpression: "SET #options_dict = :options",
        ReturnValues: "ALL_NEW",
      };

      dynamoDb.update(params, (error, result) => {
        // handle potential errors
        if (error) {
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: { "Content-Type": "text/plain" },
            body: "Couldn't fetch the todo item.",
          });
          return;
        }

        // create a response
        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Attributes),
        };
        callback(null, response);
      });
    }
  });
};
