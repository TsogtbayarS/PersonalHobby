const express = require('express');
require('dotenv').config();
const artistsController = require("../controllers/artists.controller")
const paintingsController = require("../controllers/paintings.controller")

const router = express.Router();

router.route(process.env.ARTIST_URL).get(artistsController.artistsGetAll)
    .post(artistsController.artistsAddOne);
router.route(process.env.ARTIST_URL + process.env.ARTIST_URL_ID).get(artistsController.artistsGetOne)
    .put(artistsController.artistsFullyUpdateOne)
    .patch(artistsController.artistsPartialUpdateOne)
    .delete(artistsController.artistsDeleteOne);
router.route(process.env.ARTIST_URL+process.env.ARTIST_URL_ID+process.env.PAINTINGS_URL).get(paintingsController.getAllPaintings)
    .post(paintingsController.addOnePainting);

router.route(process.env.ARTIST_URL+process.env.ARTIST_URL_ID+process.env.PAINTINGS_URL+process.env.PAINTINGS_URL_ID).get(paintingsController.getOnePainting)
    .put(paintingsController.paintingFullyUpdateOne)
    .patch(paintingsController.paintingPartialUpdateOne)
    .delete(paintingsController.deleteOnePainting);

module.exports = router;