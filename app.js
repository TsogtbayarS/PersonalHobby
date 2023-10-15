const express = require('express');
const path = require('path');
const routes = require('./api/routes');
require('dotenv').config();
require("./api/data/db.js");

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, process.env.PUBLIC_FOLDER)));
app.use("/api", function (req, res, next) {
    res.header('Access-Control-Allow-Origin',
        'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept');
    next();
});
const server = app.listen(process.env.PORT, function () {
    console.log(process.env.LISTENING_TEXT, server.address().port)
});

app.use(process.env.API_URL, routes);