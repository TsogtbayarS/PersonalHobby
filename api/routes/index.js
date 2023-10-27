const express = require('express');
require('dotenv').config();

const userRoute = require("./users.routes")
const artistsRoute = require("./artists.routes")
const paintingsRoute = require("./paintings.routes")

const router = express.Router();

router.use(process.env.ARTIST_URL, artistsRoute)
router.use(process.env.ARTIST_URL, paintingsRoute)
router.use(process.env.USER_URL, userRoute)

module.exports = router;