require("dotenv").config();
const mongoose = require("mongoose");
require("../data/artists-model");
const Artist = mongoose.model(process.env.ARTIST_MODEL);
const _responseMessage = process.env.HTTP_RESPONSE_MESSAGE;
const _parseFloatRadix = parseInt(process.env.PARSE_FLOAT_RADIX);
const _parseIntRadix = parseInt(process.env.PARSE_FLOAT_RADIX);
module.exports.artistsGetAll = function (req, res) {
    let offset = parseFloat(process.env.DEFAULT_FIND_OFFSET, _parseFloatRadix);
    let count = parseFloat(process.env.DEFAULT_FIND_COUNT, _parseFloatRadix);
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
    const response = {
        status: parseInt(process.env.HTTP_STATUS_OK),
        message: []
    };
    Artist.find().skip(offset).limit(count).exec()
        .then((artists) => {
            response.message = artists;
            console.log(response);
        })
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_ARTISTS);
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
        })
        .finally(() => res.status(response.status).json(response.message));
}
module.exports.artistsGetOne = function (req, res) {
    const artistId = req.params.artistId;
    const response = {
        status: parseInt(process.env.HTTP_STATUS_OK),
        message: []
    };
    Artist.findById(artistId).exec().then((artist) => {
        if (!artist) {

            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            response.status = parseInt(process.env.HTTP_STATUS_NOT_FOUND);
            response.message = process.env.ARTIST_ID_NOTFOUND_MESSAGE;
        }
        else {
            response.message = artist;
        }
    })
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
        })
        .finally(() => {
            res.status(response.status).json(response.message)
        });

}
module.exports.artistsAddOne = function (req, res) {
    const newArtist = {
        name: req.body.name, country: req.body.country,
        paintings: req.body.paintings
    };
    const response = { status: process.env.HTTP_STATUS_CREATED, message: [] };
    Artist.create(newArtist).then((artist) => {
        response.message = artist;
    })
        .catch((err) => {

            console.log(process.env.ERROR_ADDING_ARTIST);
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
        })
        .finally(() => {
            res.status(response.status).json(response.message);

        });

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
        .then((artist) => {
            response.status = process.env.HTTP_STATUS_CREATED;
            response.message = artist;
        })
        .catch((err) => {
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
        })
        .finally(() => {
            res.status(response.status).json(response.message);
        });
}
module.exports.artistsPartialUpdateOne = function (req, res) {
    const artistId = req.params.artistId;
    var response = {
        status: parseInt(process.env.HTTP_STATUS_OK),
        message: []
    };
    Artist.findById(artistId).exec().then((artist) => {
        if (!artist) {
            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            response.status = parseInt(process.env.HTTP_STATUS_NOT_FOUND);
            response.message = process.env.ARTIST_ID_NOTFOUND_MESSAGE;
            res.status(response.status).json(response.message);
        }
        else {
            _UpdateArtistOne(req, res, artist, response, (artistNew, updatedArtist) => _artistFillPartial(req, artistNew, updatedArtist));
        }
    })
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
            res.status(response.status).json(response.message);
        })

}
module.exports.artistsFullyUpdateOne = function (req, res) {
    const artistId = req.params.artistId;
    const response = {
        status: parseInt(process.env.HTTP_STATUS_OK),
        message: []
    };
    Artist.findById(artistId).exec().then((artist) => {
        if (!artist) {
            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            response.status = parseInt(process.env.HTTP_STATUS_NOT_FOUND);
            response.message = process.env.ARTIST_ID_NOTFOUND_MESSAGE;
            res.status(response.status).json(response.message);
        }
        else {
            _UpdateArtistOne(req, res, artist, response, (artistNew, updatedArtist) => _artistFillFully(artistNew, updatedArtist));
        }
    })
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
            res.status(response.status).json(response.message);
        });
}
module.exports.artistsDeleteOne = function (req, res) {
    const artistId = req.params.artistId;
    const response = { status: parseInt(process.env.HTTP_STATUS_NO_CONTENT), message: [] };
    Artist.findByIdAndDelete(artistId).exec().then((deletedArtist) => {
        if (!deletedArtist) {
            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            response.status = parseInt(process.env.HTTP_STATUS_NOT_FOUND);
            response.message = { [_responseMessage]: process.env.ARTIST_ID_NOTFOUND_MESSAGE };
        }
        else {
            response.message = deletedArtist;
        }
    })
        .catch((err) => {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = parseInt(process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            response.message = err;
        })
        .finally(() => {
            res.status(response.status).json(response.message);
        });
}