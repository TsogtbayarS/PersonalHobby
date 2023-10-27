const express = require('express');
require('dotenv').config();

const paintingsController = require("../controllers/paintings.controller");
const authentication = require('../authentication/authentication.controller');

const router = express.Router();

router.route(process.env.ARTIST_URL_ID + process.env.PAINTINGS_URL
    + process.env.ROOT_URL).get(paintingsController.getAllPaintings)
    .post(paintingsController.addOnePainting);

router.route(process.env.ARTIST_URL_ID + process.env.PAINTINGS_URL
    + process.env.PAINTINGS_URL_ID).get(paintingsController.getOnePainting)
    .put(paintingsController.paintingFullyUpdateOne)
    .patch(paintingsController.paintingPartialUpdateOne)
    .delete(authentication.authenticate, paintingsController.deleteOnePainting);

module.exports = router;
