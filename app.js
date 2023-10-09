const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const server = app.listen(process.env.PORT, function () {
    console.log(process.env.LISTENING_TEXT, server.address().port)
});

app.use(express.static(path.join(__dirname, 'public')))