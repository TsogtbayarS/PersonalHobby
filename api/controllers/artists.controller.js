require("dotenv").config();
const callbackify = require('util').callbackify;
const mongoose = require("mongoose");
require("../data/artists-model");
const Artist = mongoose.model(process.env.ARTIST_MODEL);

const ArtistFindExecWithCallback = callbackify(function (offset, count) {
    return Artist.find().skip(offset).limit(count).exec()
})

const ArtistFindByIdExecWithCallback = callbackify(function (artistId) {
    return Artist.findById(artistId).exec();
})

const ArtistCreateWithCallback = callbackify(function (artist) {
    return Artist.create(artist)
})

const ArtistFindByIdAndDeleteExecWithCallback = callbackify(function (artistId) {
    return Artist.findByIdAndDelete(artistId).exec()
})

const ArtistFindByIdAndUpdateWithCallback = callbackify(function () {
    return Artist.findByIdAndUpdate();
})
module.exports.artistsGetAll = function (req, res) {
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
    ArtistFindExecWithCallback(offset, count, function (err, artists) {
        const response = {
            status: 200,
            message: artists
        };
        if (err) {
            console.log(process.env.ERROR_MESSAGE_ARTISTS);
            response.status = 500;
            response.message = err;
        }
        res.status(response.status).json(response.message);
    });
}

module.exports.artistsGetOne = function (req, res) {
    const artistId = req.params.artistId;
    ArtistFindByIdExecWithCallback(artistId, function (err, artist) {
        const response = {
            status: 200,
            message: artist
        };
        if (err) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = 500;
            response.message = err;
        }
        else if (!artist) {
            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            response.status = 404;
            response.message = process.env.ARTIST_ID_NOTFOUND_MESSAGE;
        }
        res.status(response.status).json(response);
    });

}

module.exports.artistsAddOne = function (req, res) {
    const newArtist = {
        name: req.body.name, country: req.body.country,
        paintings: req.body.paintings
    };
    ArtistCreateWithCallback(newArtist, function (err, artist) {
        const response = { status: 201, message: artist };
        if (err) {
            console.log(process.env.ERROR_ADDING_ARTIST);
            response.status = 500;
            response.message = err;
        }
        res.status(response.status).json(response.message);
    });

}

const _partialUpdateArtist = function (req, res, artistNew) {
    const updatedArtist = req.body;
    if (req.body.name) {
        artistNew.name = updatedArtist.name;
    }
    if (req.body.country) {
        artistNew.country = updatedArtist.country;
    }
    if (req.body.paintings) {
        artistNew.paintings = updatedArtist.paintings;
    }
    artistNew.save(function (err, artist) {
        const response = {
            status: 204,
            message: []
        };
        if (err) {
            response.status = 500;
            response.message = err;
        } else {
            response.status = 201;
            response.message = artist;
        }
        res.status(response.status).json(response.message);
    })
}
module.exports.artistsPartialUpdateOne = function (req, res) {
    const artistId = req.params.artistId;
    ArtistFindByIdExecWithCallback(artistId, function (err, artist) {
        const response = {
            status: 200,
            message: artist
        };
        if (err) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = 500;
            response.message = err;
            res.status(response.status).json(response);
        }
        else if (!artist) {
            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            response.status = 404;
            response.message = process.env.ARTIST_ID_NOTFOUND_MESSAGE;
            res.status(response.status).json(response);
        }
        else {
            _partialUpdateArtist(req, res, artist);
        }
    })

}
const _fullUpdateArtist = function (req, res, artistNew) {
    const updatedArtist = req.body;
    artistNew.name = updatedArtist.name;
    artistNew.country = updatedArtist.country;
    artistNew.paintings = updatedArtist.paintings;
    artistNew.save(function (err, artist) {
        console.log(artist);
        const response = {
            status: 204,
            message: []
        };
        if (err) {
            response.status = 500;
            response.message = err;
        } else {
            response.status = 201;
            response.message = artist;
        }
        res.status(response.status).json(response.message);
    })
}
module.exports.artistsFullyUpdateOne = function (req, res) {
    const artistId = req.params.artistId;
    ArtistFindByIdExecWithCallback(artistId, function (err, artist) {
        const response = {
            status: 200,
            message: artist
        };
        if (err) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = 500;
            response.message = err;
            res.status(response.status).json(response);
        }
        else if (!artist) {
            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            response.status = 404;
            response.message = process.env.ARTIST_ID_NOTFOUND_MESSAGE;
            res.status(response.status).json(response);
        }
        else {
            _fullUpdateArtist(req, res, artist);
        }
    })
}

module.exports.artistsDeleteOne = function (req, res) {
    const artistId = req.params.artistId;
    ArtistFindByIdAndDeleteExecWithCallback(artistId, function (err, deletedArtist) {
        console.log(deletedArtist);
        const response = { status: 204, message: deletedArtist };
        if (err) {
            console.log(process.env.ERROR_MESSAGE_ARTIST);
            response.status = 500;
            response.message = err;
        } else if (!deletedArtist) {
            console.log(process.env.ARTIST_ID_NOTFOUND_MESSAGE);
            response.status = 404;
            response.message = { "message": process.env.ARTIST_ID_NOTFOUND_MESSAGE };
        }
        res.status(response.status).json(response);
    });
}