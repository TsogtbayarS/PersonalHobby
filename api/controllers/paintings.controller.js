require("dotenv").config();
const callbackify = require('util').callbackify;
require("../data/artists-model");
const mongoose = require("mongoose");
const Artist = mongoose.model('Artist');

const ArtistFindByIdSelectPaintingsExecWithCallback = callbackify(function (artistId) {
    return Artist.findById(artistId).select("paintings").exec();
});

const ArtistFindByIdSelectPaintingsFindByIdExecWithCallback = callbackify(function (artistId, paintingId) {
    return Artist.findById(artistId).select("paintings").find({}).exec();
});

module.exports.getAllPaintings = function (req, res) {
    let offset = parseFloat(process.env.DEFAULT_FIND_OFFSET, 10);
    let count = parseFloat(process.env.DEFAULT_FIND_COUNT, 10);
    const maxCount = parseInt(process.env.DEFAULT_MAX_FIND_LIMIT, 10);
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }
    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }
    if (isNaN(offset) || isNaN(count)) {
        res.status(400).json({ "message": process.env.VALIDATION_OFFSET_COUNT_TYPE });
        return;
    }
    if (count > maxCount) {
        res.status(400).json({ "message": process.env.CANNOT_EXCEED_COUNT + maxCount });
        return;
    }
    const artistId = req.params.artistId;
    ArtistFindByIdSelectPaintingsExecWithCallback(artistId, function (err, Artist) {
        console.log(Artist.paintings);
        const response = {
            status: 200,
            message: process.env.RESPONSE_MESSAGE_DEFAULT
        };
        if (err) {
            console.log(process.env.ERROR_MESSAGE_PAINTINGS);
            response.status = 500;
            response.message = err;
        }
        else if (!Artist) {
            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            response.status = 404;
            response.message = process.env.ARTIST_ID_NOTFOUND_MESSAGE;
        }
        else if (Artist.paintings.length === 0) {
            console.log(process.env.PAINTINGS_NOT_FOUND);
            response.status = 404;
            response.message = process.env.PAINTINGS_NOT_FOUND;
        }
        else {
            response.message = Artist.paintings;
        }
        res.status(response.status).json(response.message);
    });
}

module.exports.getOnePainting = function (req, res) {
    const artistId = req.params.artistId;
    const paintingId = req.params.paintingId;

    ArtistFindByIdSelectPaintingsFindByIdExecWithCallback(artistId, paintingId, function (err, Artist) {
        console.log(Artist[0]);
        const response = {
            status: 200,
            message: Artist[0]
        };
        if (err) {
            console.log(process.env.ERROR_MESSAGE_PAINTING);
            response.status = 500;
            response.message = err;
        }
        else if (!Artist[0]) {
            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            response.status = 404;
            response.message = process.env.ARTIST_ID_NOTFOUND_MESSAGE;
        }
        else if (!Artist[0].paintings.id(paintingId)) {
            console.log(process.env.PAINTING_ID_NOTFOUND_MESSAGE);
            response.status = 404;
            response.message = process.env.PAINTING_ID_NOTFOUND_MESSAGE;
        }
        else {
            response.message = Artist[0].paintings.id(paintingId);
        }
        res.status(response.status).json(response.message);
    })
}
const _addPaintings = function (req, res, artist) {
    const painting = {
        name: req.body.name,
        year: parseInt(req.body.year)
    };
    artist.paintings.push(painting);
    artist.save(function (err, updatedArtist) {
        const response = { status: 200, message: [] };
        if (err) {
            response.status = 500;
            response.message = err;
        } else {
            response.status = 201;
            response.message = updatedArtist.paintings;
        }
        res.status(response.status).json(response.message);
    });
}
module.exports.addOnePainting = function (req, res) {
    const artistId = req.params.artistId;
    ArtistFindByIdSelectPaintingsExecWithCallback(artistId, function (err, artist) {
        const response = { status: 200, message: artist };
        if (err) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = 500;
            response.message = err;
        } else if (!artist) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = 404;
            response.message = { "message": process.env.ARTIST_ID_NOTFOUND_MESSAGE + artistId };
        }
        if (artist) {
            _addPaintings(req, res, artist);
        } else {
            res.status(response.status).json(response.message);
        }
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
    artist.save(function (err, updatedArtist) {
        const response = {
            status: 204,
            message: []
        };
        if (err) {
            response.status = 500;
            response.message = err;
        } else {
            response.status = 201;
            response.message = updatedArtist.paintings;
        }
        res.status(response.status).json(response.message);
    });
}

module.exports.deleteOnePainting = function (req, res) {
    const artistId = req.params.artistId;
    ArtistFindByIdSelectPaintingsExecWithCallback(artistId, function (err, artist) {
        const response = { status: 200, message: artist };
        if (err) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = 500;
            response.message = err;
        } else if (!artist) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = 404;
            response.message = { "message": process.env.ARTIST_ID_NOTFOUND_MESSAGE + artistId };
        }
        if (artist) {
            _deletePainting(req, res, artist);
        } else {
            res.status(response.status).json(response.message);
        }
    });
}
const _partialUpdatePainting = function (req, res, artist) {
    const paintingId = req.params.paintingId;
    var paintings = [];
    paintings = artist.paintings;
    paintings.map(painting => {
        if (painting.id === paintingId) {
            if (req.body.name) {
                painting.name = req.body.name;
            }
            if (req.body.year) {
                painting.year = req.body.year;
            }
        }
    })
    artist.paintings = paintings;
    artist.save(function (err, updatedArtist) {
        let returnMessage;
        updatedArtist.paintings.filter(painting => {
            if (painting.id = req.params.paintingId) {
                returnMessage = painting;
            }
        });
        const response = {
            status: 204,
            message: []
        };
        if (err) {
            response.status = 500;
            response.message = err;
        } else {
            response.status = 201;
            response.message = returnMessage;
        }
        res.status(response.status).json(response.message);
    });

}
module.exports.paintingPartialUpdateOne = function (req, res) {
    const artistId = req.params.artistId;
    ArtistFindByIdSelectPaintingsExecWithCallback(artistId, function (err, artist) {
        const response = { status: 200, message: artist };
        if (err) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = 500;
            response.message = err;
        } else if (!artist) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = 404;
            response.message = { "message": process.env.ARTIST_ID_NOTFOUND_MESSAGE + artistId };
        }
        if (artist) {
            _partialUpdatePainting(req, res, artist);
        } else {
            res.status(response.status).json(response.message);
        }
    });

}

const _fullyUpdatePainting = function (req, res, artist) {
    const paintingId = req.params.paintingId;
    var paintings = [];
    paintings = artist.paintings;
    paintings.map(painting => {
        if (painting.id === paintingId) {
            painting.name = req.body.name;
            painting.year = req.body.year;
        }
    })
    artist.paintings = paintings;
    artist.save(function (err, updatedArtist) {
        let returnMessage;
        updatedArtist.paintings.filter(painting => {
            if (painting.id = req.params.paintingId) {
                returnMessage = painting;
            }
        });
        const response = {
            status: 204,
            message: []
        };
        if (err) {
            response.status = 500;
            response.message = err;
        } else {
            response.status = 201;
            response.message = returnMessage;
        }
        res.status(response.status).json(response.message);
    });

}
module.exports.paintingFullyUpdateOne = function (req, res) {
    const artistId = req.params.artistId;
    ArtistFindByIdSelectPaintingsExecWithCallback(artistId, function (err, artist) {
        const response = { status: 200, message: [] };
        if (err) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = 500;
            response.message = err;
        } else if (!artist) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = 404;
            response.message = { "message": process.env.ARTIST_ID_NOTFOUND_MESSAGE + artistId };
        }
        if (artist) {
            _fullyUpdatePainting(req, res, artist);
        } else {
            res.status(response.status).json(response.message);
        }
    });

}