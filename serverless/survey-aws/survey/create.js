"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
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

  //Check if the title and description are a string.
  if (typeof data.title && data.description !== "string") {
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't create the todo item.",
    });
    return;
  }

  let options = [];

  for (let i = 0; i < Object.keys(data.options).length; i++) {
    const option = {};
    option[i] = {
      id: uuid.v1(),
      description: data.options[i].description,
      votes: 0,
    };
    options.push(option[i]);
  }

  //Validate if the string is empty and if it's duplicated or not.
  if (options.length == 0) {
    callback({
      statusCode: 400,
      body: "Couldn\'t create the todo item.",
    }); 
    return;
  // } else if(options.includes(description)) {
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      title: data.title,
      description: data.description,
      options: options,
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't create the todo item.",
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
