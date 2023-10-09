const mongoose = require('mongoose');
require("dotenv").config();

const paintingsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year:  {
        type: Number,
        required: true
    }
});

const artistsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    paintings: [paintingsSchema]
});

const Artist = mongoose.model(process.env.ARTIST_MODEL, artistsSchema);

module.exports = { Artist };