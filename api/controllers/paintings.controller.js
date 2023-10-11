require("dotenv").config();
const callbackify = require('util').callbackify;
require("../data/artists-model");
const mongoose = require("mongoose");
const Artist = mongoose.model('Artist');
const _responseMessage = process.env.HTTP_RESPONSE_MESSAGE;
const _parseFloatRadix = parseInt(process.env.PARSE_FLOAT_RADIX);
const _parseIntRadix = parseInt(process.env.PARSE_FLOAT_RADIX);

const getAllPaintings = function (req, res) {
    let offset = parseFloat(process.env.DEFAULT_FIND_OFFSET, [_parseFloatRadix]);
    let count = parseFloat(process.env.DEFAULT_FIND_COUNT, [_parseFloatRadix]);
    const maxCount = parseInt(process.env.DEFAULT_MAX_FIND_LIMIT, [_parseIntRadix]);
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, [_parseIntRadix]);
    }
    if (req.query && req.query.count) {
        count = parseInt(req.query.count, [_parseIntRadix]);
    }
    if (isNaN(offset) || isNaN(count)) {
        res.status(parseInt(process.env.HTTP_STATUS_BAD_REQUEST)).json({ [_responseMessage]: process.env.VALIDATION_OFFSET_COUNT_TYPE });
        return;
    }
    if (count > maxCount) {
        res.status(parseInt(process.env.HTTP_STATUS_BAD_REQUEST)).json({ [_responseMessage]: process.env.CANNOT_EXCEED_COUNT + maxCount });
        return;
    }
    const artistId = req.params.artistId;
    const response = {
        status: parseInt(process.env.HTTP_STATUS_OK),
        message: process.env.RESPONSE_MESSAGE_DEFAULT
    };
    Artist.findById(artistId).select(process.env.SUB_DOCUMENT_NAME).exec().then((Artist) => {
        if (!Artist) {
            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            response.status = parseInt(process.env.HTTP_STATUS_NOT_FOUND);
            response.message = process.env.ARTIST_ID_NOTFOUND_MESSAGE;
        }
        else if (Artist.paintings.length === 0) {
            console.log(process.env.PAINTINGS_NOT_FOUND);
            response.status = parseInt(process.env.HTTP_STATUS_NOT_FOUND);
            response.message = process.env.PAINTINGS_NOT_FOUND;
        }
        else {
            response.message = Artist.paintings;
        }
    })
        .catch((err) => {

            console.log(process.env.ERROR_MESSAGE_PAINTINGS);
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
        })
        .finally(() => {

            res.status(response.status).json(response.message);
        });
}

const getOnePainting = function (req, res) {
    const artistId = req.params.artistId;
    const paintingId = req.params.paintingId;
    const response = {
        status: parseInt(process.env.HTTP_STATUS_OK),
        message: []
    };

    Artist.findById(artistId).select(process.env.SUB_DOCUMENT_NAME).exec().then((Artist) => {
        if (!Artist) {
            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            response.status = parseInt(process.env.HTTP_STATUS_NOT_FOUND);
            response.message = process.env.ARTIST_ID_NOTFOUND_MESSAGE;
        }
        else if (!Artist.paintings.id(paintingId)) {
            console.log(process.env.PAINTING_ID_NOTFOUND_MESSAGE);
            response.status = parseInt(process.env.HTTP_STATUS_NOT_FOUND);
            response.message = process.env.PAINTING_ID_NOTFOUND_MESSAGE;
        }
        else {
            response.message = Artist.paintings.id(paintingId);
        }
    })
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_PAINTING);
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
        })
        .finally(() => {
            res.status(response.status).json(response.message);
        })
}
const _addPaintings = function (req, res, artist) {
    const painting = {
        name: req.body.name,
        year: parseInt(req.body.year)
    };
    artist.paintings.push(painting);
    const response = { status: parseInt(process.env.HTTP_STATUS_OK), message: [] };
    artist.save().then((updatedArtist) => {
        response.status = parseInt(process.env.HTTP_STATUS_CREATED);
        response.message = updatedArtist.paintings;
    })
        .catch((err) => {
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
        })
        .finally(() => {
            res.status(response.status).json(response.message);
        });
}
const addOnePainting = function (req, res) {
    const artistId = req.params.artistId;
    const response = { status: parseInt(process.env.HTTP_STATUS_OK), message: [] };
    Artist.findById(artistId).select(process.env.SUB_DOCUMENT_NAME).exec().then((artist) => {
        if (!artist) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = parseInt(process.env.HTTP_STATUS_NOT_FOUND);
            response.message = { [_responseMessage]: process.env.ARTIST_ID_NOTFOUND_MESSAGE + artistId };
            res.status(response.status).json(response.message);
        }
        else {
            _addPaintings(req, res, artist);
        }
    })
        .catch((err) => {
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
            res.status(response.status).json(response.message);
        });
}
const _deletePainting = function (req, res, artist) {
    const paintingId = req.params.paintingId;
    var paintings = [];
    paintings = artist.paintings;
    paintings.map(painting => {
        if (painting.id === paintingId) {
            painting.name = process.env.DELETE_VALUE;
            painting.year = process.env.DELETE_VALUE_NUMBER;
        }
    })
    artist.paintings = paintings;
    const response = {
        status: parseInt(process.env.HTTP_STATUS_NO_CONTENT),
        message: []
    };
    artist.save().then((updatedArtist) => {
        response.status = parseInt(process.env.HTTP_STATUS_CREATED);
        response.message = updatedArtist.paintings;
        res.status(response.status).json(response.message);
    })
        .catch(
            (err) => {
                response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
                response.message = err;
            })
        .finally(res.status(response.status).json(response.message));
}

const deleteOnePainting = function (req, res) {
    const artistId = req.params.artistId;
    const response = { status: parseInt(process.env.HTTP_STATUS_OK), message: [] };
    Artist.findById(artistId).select(process.env.SUB_DOCUMENT_NAME).exec().then((artist) => {
        if (!artist) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = parseInt(process.env.HTTP_STATUS_NOT_FOUND);
            response.message = { [_responseMessage]: process.env.ARTIST_ID_NOTFOUND_MESSAGE + artistId };
            res.status(response.status).json(response.message);
        }
        else {
            _deletePainting(req, res, artist);
        }
    })
        .catch((err) => {

            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
            res.status(response.status).json(response.message);
        });
}
const _paintingFillFull = function (painting, req) {
    painting.name = req.body.name;
    painting.year = req.body.year;
}
const _paintingFillPartial = function (painting, req) {
    if (req.body.name) {
        painting.name = req.body.name;
    }
    if (req.body.year) {
        painting.year = req.body.year;
    }
}
const _UpdatePainting = function (req, res, artist, _paintingFillCallback) {
    const paintingId = req.params.paintingId;
    var paintings = [];
    paintings = artist.paintings;
    paintings.map(painting => {
        if (painting.id === paintingId) {
            _paintingFillCallback(painting, req)
        }
    })
    artist.paintings = paintings;
    const response = {
        status: parseInt(process.env.HTTP_STATUS_NO_CONTENT),
        message: []
    };
    artist.save().then((updatedArtist) => {
        let returnMessage = updatedArtist.paintings.filter((painting) => painting.id === req.params.paintingId);
        if (undefined !== returnMessage && null !== returnMessage) {
            response.status = parseInt(process.env.HTTP_STATUS_CREATED);
            response.message = returnMessage;
        }
        else {
            throw ("Error")
        }
    })
        .catch((err) => {
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
        })
        .finally(() => {

            res.status(response.status).json(response.message);
        });

}
const paintingPartialUpdateOne = function (req, res) {
    const artistId = req.params.artistId;
    const response = { status: parseInt(process.env.HTTP_STATUS_NOT_FOUND), message: process.env.ARTIST_ID_NOTFOUND_MESSAGE + artistId };
    Artist.findById(artistId).select(process.env.SUB_DOCUMENT_NAME).exec().then((artist) => {
        if (artist) {
            _UpdatePainting(req, res, artist, (painting, req) => _paintingFillPartial(painting, req));
        } else {
            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            res.status(response.status).json(response.message);
        }
    })
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
            res.status(response.status).json(response.message);
        });

}
const paintingFullyUpdateOne = function (req, res) {
    const artistId = req.params.artistId;
    const response = { status: parseInt(process.env.HTTP_STATUS_NOT_FOUND), message: process.env.ARTIST_ID_NOTFOUND_MESSAGE + artistId };
    Artist.findById(artistId).select(process.env.SUB_DOCUMENT_NAME).exec().then((artist) => {
        if (artist) {
            _UpdatePainting(req, res, artist, (painting, req) => _paintingFillFull(painting, req));
        } else {
            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            res.status(response.status).json(response.message);
        }
    })
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
            res.status(response.status).json(response.message);
        })

}

module.exports = {
    getAllPaintings,
    getOnePainting,
    addOnePainting,
    deleteOnePainting,
    paintingFullyUpdateOne,
    paintingPartialUpdateOne,
}