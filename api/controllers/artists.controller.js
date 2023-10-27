require("dotenv").config();
require("../data/artists-model");

const mongoose = require("mongoose");
const Artist = mongoose.model(process.env.ARTIST_MODEL);

const _responseMessage = process.env.HTTP_RESPONSE_MESSAGE;
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
const artistsGetAll = function (req, res) {
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
    const response = _createResponse();
    Artist.find().skip(offset).limit(count).exec()
        .then((artists) => _setResponse(response, parseInt(process.env.HTTP_STATUS_OK), artists))
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_ARTISTS);
            _setResponse(response, parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR), { "message": err })
        })
        .finally(() => res.status(response.status).json(response.message));
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

const artistsGetOne = function (req, res) {
    const response = _createResponse();
    Artist.findById(req.params.artistId).exec()
        .then((artist) => _checkArtistExists(artist)
            .then(() => _setResponse(response, parseInt(process.env.HTTP_STATUS_OK), artist))
            .catch(() => _setResponse(response, parseInt(process.env.HTTP_STATUS_NOT_FOUND), { "message": process.env.ARTIST_ID_NOTFOUND_MESSAGE })
            ))
        .catch((err) => _setResponse(response, parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR), { "message": err }))
        .finally(() => res.status(response.status).json(response.message));
}

const _createArtist = function (req) {
    return {
        name: req.body.name,
        country: req.body.country,
        paintings: req.body.paintings
    }
}
const artistsAddOne = function (req, res) {
    const newArtist = _createArtist(req);
    const response = _createResponse();
    Artist.create(newArtist)
        .then((artist) => _setResponse(response, process.env.HTTP_STATUS_CREATED, artist))
        .catch((err) => _setResponse(response, process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR, { "message": err }))
        .finally(() => res.status(response.status).json(response.message));

}
const _artistFillPartial = function (req, artistNew, updatedArtist) {
    if (req.body.name) {
        artistNew.name = updatedArtist.name;
    }
    if (req.body.country) {
        artistNew.country = updatedArtist.country;
    }
    if (req.body.paintings) {
        artistNew.paintings = updatedArtist.paintings;
    }

}
const _artistFillFully = function (artistNew, updatedArtist) {
    artistNew.name = updatedArtist.name;
    artistNew.country = updatedArtist.country;
    artistNew.paintings = updatedArtist.paintings;

}
const _UpdateArtistOne = function (req, res, artistNew, response, fillArtistCallback) {
    const updatedArtist = req.body;
    fillArtistCallback(artistNew, updatedArtist)
    artistNew.save()
        .then((artist) => _setResponse(response, process.env.HTTP_STATUS_CREATED, artist))
        .catch((err) => _setResponse(response, process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR, { "message": err }))
        .finally(() => res.status(response.status).json(response.message));
}
const artistsPartialUpdateOne = function (req, res) {
    const artistId = req.params.artistId;
    var response = _createResponse();
    Artist.findById(artistId).exec()
        .then((artist) => _checkArtistExists(artist)
            .then(() => _UpdateArtistOne(req, res, artist, response, (artistNew, updatedArtist) => _artistFillPartial(req, artistNew, updatedArtist)))
            .catch(() => _setResponse(response, parseInt(process.env.HTTP_STATUS_NOT_FOUND), { "message": process.env.ARTIST_ID_NOTFOUND_MESSAGE })
            ))
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            _setResponse(response, process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR, { "message": err })
            res.status(response.status).json(response.message);
        })

}
const artistsFullyUpdateOne = function (req, res) {
    const artistId = req.params.artistId;
    const response = _createResponse();
    Artist.findById(artistId).exec()
        .then((artist) => _checkArtistExists(artist)
            .then(() => _UpdateArtistOne(req, res, artist, response, (artistNew, updatedArtist) => _artistFillFully(artistNew, updatedArtist)))
            .catch(() => _setResponse(response, parseInt(process.env.HTTP_STATUS_NOT_FOUND), { "message": process.env.ARTIST_ID_NOTFOUND_MESSAGE })
            ))
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            _setResponse(response, process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR, { "message": err })
            res.status(response.status).json(response.message);
        });
}
const artistsDeleteOne = function (req, res) {
    const artistId = req.params.artistId;
    const response = { status: parseInt(process.env.HTTP_STATUS_NO_CONTENT), message: [] };
    Artist.findByIdAndDelete(artistId).exec()
        .then((deletedArtist) => _checkArtistExists(deletedArtist)
            .then(() => _setResponse(response, process.env.HTTP_STATUS_NO_CONTENT, deletedArtist))
            .catch(() => _setResponse(response, parseInt(process.env.HTTP_STATUS_NOT_FOUND), { "message": process.env.ARTIST_ID_NOTFOUND_MESSAGE })
            ))
        .catch((err) => _setResponse(response, process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR, { "message": err }))
        .finally(() => res.status(response.status).json(response.message));
}

module.exports = {
    artistsGetAll,
    artistsGetOne,
    artistsAddOne,
    artistsDeleteOne,
    artistsFullyUpdateOne,
    artistsPartialUpdateOne
}