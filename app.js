const express = require('express');
const path = require('path');
const routes = require('./api/routes');
require('dotenv').config();
require("./api/data/db.js");

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, process.env.PUBLIC_FOLDER)));

app.use(process.env.API_URL, function (req, res, next) {
    res.header(process.env.ACCESS_CONTROL_ALLOW_ORIGIN, process.env.FRONTEND_DOMAIN);
    res.header(process.env.ACCESS_CONTROL_ALLOW_METHODS, process.env.ALLOW_HEADER_METHODS);
    res.header(process.env.ACCESS_CONTROL_ALLOW_HEADERS, process.env.ALLOW_HEADER);
    next();
});

const server = app.listen(process.env.PORT, function () {
    console.log(process.env.LISTENING_TEXT, server.address().port)
});

app.use(process.env.API_URL, routes);