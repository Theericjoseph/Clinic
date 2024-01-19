// index.js

require('dotenv').config();

//@ts-check
"use strict";
const express = require('express');

const app = express();

//to parse json it parses the incoming request's body (if it contains JSON) and makes the parsed data available in req.body
app.use(express.json()); // This middleware is used to parse incoming requests with JSON payloads. 
app.use(express.urlencoded({ extended: true }));

const server = require('./server/apis'); // Import the apis module

app.use(express.static('html'));         // To use all the html files
app.use(express.static('css'));         // To use all the html files
app.use(express.static('js'));         // To use all the html files
app.use(express.static('scss'));

// Use the routes defined in the apis module 
app.use('/', server);

app.listen(3000, () => {
    console.log("Connected to port 3000");
});