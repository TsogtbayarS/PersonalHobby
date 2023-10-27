require("dotenv").config();
require("../data/artists-model");
const mongoose = require("mongoose");
const Artist = mongoose.model('Artist');

const _responseMessage = process.env.HTTP_RESPONSE_MESSAGE;
const _parseFloatRadix = parseInt(process.env.PARSE_FLOAT_RADIX);
const _parseIntRadix = parseInt(process.env.PARSE_FLOAT_RADIX);

const _createResponse = function () {
    return {
        status: parseInt(process.env.HTTP_STATUS_OK),
        message: []
    }
}

const _setResponse = function (response, status, message) {
    response.status = status;
    response.message = message;
}

const _checkOffset = function (req) {
    if (req.query && req.query.offset) {
        return parseInt(req.query.offset, [_parseIntRadix]);
    }
    else {
        return parseInt(process.env.DEFAULT_FIND_OFFSET, _parseIntRadix)
    }
}
const _checkCount = function (req) {
    if (req.query && req.query.count) {
        return parseInt(req.query.count, [_parseIntRadix]);
    }
    else {
        return parseInt(process.env.DEFAULT_FIND_COUNT, _parseIntRadix)
    }
}
const _checkArtistExists = function (artist) {
    return new Promise((resolve, reject) => {
        if (!artist) {
            reject();
        }
        else {
            resolve();
        }
    });
}
const getAllPaintings = function (req, res) {
    let offset = _checkOffset(req);
    let count = _checkCount(req);
    const maxCount = parseInt(process.env.DEFAULT_MAX_FIND_LIMIT, [_parseIntRadix]);
    if (isNaN(offset) || isNaN(count)) {
        res.status(parseInt(process.env.HTTP_STATUS_BAD_REQUEST)).json({ [_responseMessage]: process.env.VALIDATION_OFFSET_COUNT_TYPE });
        return;
    }
    if (count > maxCount) {
        res.status(parseInt(process.env.HTTP_STATUS_BAD_REQUEST)).json({ [_responseMessage]: process.env.CANNOT_EXCEED_COUNT + maxCount });
        return;
    }
    const artistId = req.params.artistId;
    const response = _createResponse();
    Artist.findById(artistId).select(process.env.SUB_DOCUMENT_NAME).exec()
        .then((Artist) => _checkArtistExists(Artist)
            .then(() => _setResponse(response, parseInt(process.env.HTTP_STATUS_OK), Artist.paintings))
            .catch(() => _setResponse(response, parseInt(process.env.HTTP_STATUS_NOT_FOUND), { "message": process.env.PAINTINGS_NOT_FOUND })
            ))
        .catch((err) => _setResponse(response, parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR), { "message": err }))
        .finally(() => res.status(response.status).json(response.message));
}

const getOnePainting = function (req, res) {
    const artistId = req.params.artistId;
    const paintingId = req.params.paintingId;
    const response = _createResponse();

    Artist.findById(artistId).select(process.env.SUB_DOCUMENT_NAME).exec()
        .then((Artist) => _checkArtistExists(Artist)
            .then(() => _setResponse(response, parseInt(process.env.HTTP_STATUS_OK), Artist.paintings.id(paintingId)))
            .catch(() => _setResponse(response, parseInt(process.env.HTTP_STATUS_NOT_FOUND), { "message": process.env.PAINTINGS_NOT_FOUND }))
        )
        .catch((err) => _setResponse(response, parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR), { "message": err }))
        .finally(() => res.status(response.status).json(response.message))
}

const _createPainting = function (req) {
    return {
        name: req.body.name,
        year: parseInt(req.body.year)
    }
}

const _addPaintings = function (response, res, artist, req) {
    const painting = _createPainting(req);
    artist.paintings.push(painting);
    response = _createResponse();
    artist.save()
        .then((updatedArtist) => {
            _setResponse(response, parseInt(process.env.HTTP_STATUS_CREATED), updatedArtist.paintings)
        })
        .catch((err) => {
            _setResponse(response, parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR), { "message": err })
        })
        .finally(() => res.status(response.status).json(response.message));
}

const addOnePainting = function (req, res) {
    const artistId = req.params.artistId;
    const response = _createResponse();
    Artist.findById(artistId).select(process.env.SUB_DOCUMENT_NAME).exec()

        .then((artist) => _checkArtistExists(artist)
            .then(() => _addPaintings(response, res, artist, req))
            .catch(() => {
                _setResponse(response, parseInt(process.env.HTTP_STATUS_NOT_FOUND), { [_responseMessage]: process.env.ARTIST_ID_NOTFOUND_MESSAGE + " " + artistId })
                res.status(response.status).json(response.message);
            }))
        .catch((err) => {
            _setResponse(response, parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR), { "message": err })
            res.status(response.status).json(response.message);
        });
}
const _blankPainting = function (req, artist) {
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
    return artist;
}
const _deletePainting = function (req, res, artist) {
    artist = _blankPainting(req, artist)
    const response = _createResponse();
    artist.save()
        .then((updatedArtist) => _setResponse(response, parseInt(process.env.HTTP_STATUS_CREATED), updatedArtist.paintings))
        .catch((err) => _setResponse(response, parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR), { "message": err }))
        .finally(res.status(response.status).json(response.message));
}

const deleteOnePainting = function (req, res) {
    const artistId = req.params.artistId;
    const response = _createResponse();
    Artist.findById(artistId).select(process.env.SUB_DOCUMENT_NAME).exec()
        .then((artist) => _checkArtistExists(artist)
            .then(() => _deletePainting(req, res, artist))
            .catch(() => {
                _setResponse(response, parseInt(process.env.HTTP_STATUS_NOT_FOUND), { [_responseMessage]: process.env.ARTIST_ID_NOTFOUND_MESSAGE + " " + artistId })
                res.status(response.status).json(response.message);
            }))
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            _setResponse(response, parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR), { "message": err })
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
    const response = _createResponse();
    artist.save().then((updatedArtist) => {
        let returnMessage = updatedArtist.paintings.filter((painting) => painting.id === req.params.paintingId);
        if (undefined !== returnMessage && null !== returnMessage) {
            _setResponse(response, parseInt(process.env.HTTP_STATUS_CREATED), returnMessage)
        }
        else {
            throw (process.env.ERROR)
        }
    })
        .catch((err) => {
            _setResponse(response, parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR), { "message": err })
        })
        .finally(() => {
            res.status(response.status).json(response.message);
        });

}
const paintingPartialUpdateOne = function (req, res) {
    const artistId = req.params.artistId;
    const response = _createResponse();;
    Artist.findById(artistId).select(process.env.SUB_DOCUMENT_NAME).exec()
        .then((artist) => _checkArtistExists(artist)
            .then(() => _UpdatePainting(req, res, artist, (painting, req) => _paintingFillPartial(painting, req)))
            .catch(() => {
                _setResponse(response, parseInt(process.env.HTTP_STATUS_NOT_FOUND), { [_responseMessage]: process.env.ARTIST_ID_NOTFOUND_MESSAGE + " " + artistId })
                res.status(response.status).json(response.message);
            }))
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            _setResponse(response, parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR), { "message": err })
            res.status(response.status).json(response.message);
        });

}
const paintingFullyUpdateOne = function (req, res) {
    const artistId = req.params.artistId;
    const response = _createResponse();
    Artist.findById(artistId).select(process.env.SUB_DOCUMENT_NAME).exec()
        .then((artist) => _checkArtistExists(artist)
            .then(() => _UpdatePainting(req, res, artist, (painting, req) => _paintingFillFull(painting, req)))
            .catch(() => {
                _setResponse(response, parseInt(process.env.HTTP_STATUS_NOT_FOUND), { [_responseMessage]: process.env.ARTIST_ID_NOTFOUND_MESSAGE + " " + artistId })
                res.status(response.status).json(response.message);
            }))
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            _setResponse(response, parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR), { "message": err })
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