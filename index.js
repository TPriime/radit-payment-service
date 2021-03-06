// importing app components
const express = require("express");
const app = express();
require("dotenv").config();

// this will have the environment and configuration for the application
const appConfig = require("./core/config");

// function that helps with connecting to database
const connectToDB = require("./core/db").connectToDB;

/// function that helps with connecting to rabbit message queue
const connectToMQ = require("./core/mq").connectToMQ;

// function that helps to start the server
const initServer = require("./core/server").initServer;

// connecting to database
connectToDB(appConfig);

// connecting to message queue
connectToMQ(appConfig);

// initialising server
initServer(app, appConfig);

module.exports.server = app;