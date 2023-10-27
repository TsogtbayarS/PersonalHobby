const express = require('express');
require('dotenv').config();

const artistsController = require("../controllers/artists.controller");
const authentication = require('../authentication/authentication.controller');
const router = express.Router();

router.route(process.env.ROOT_URL).get(artistsController.artistsGetAll)
    .post(artistsController.artistsAddOne);

router.route(process.env.ARTIST_URL_ID).get(artistsController.artistsGetOne)
    .put(artistsController.artistsFullyUpdateOne)
    .patch(artistsController.artistsPartialUpdateOne)
    .delete(authentication.authenticate, artistsController.artistsDeleteOne);

module.exports = router;
