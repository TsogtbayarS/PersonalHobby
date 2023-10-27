require("dotenv").config();
require("../data/users-model");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const jwt = require('jsonwebtoken');

const _createUser = function (req, hashedPassword) {
    return {
        name: req.body.name,
        username: req.body.username,
        password: hashedPassword
    }
}

const _createUserInfo = function (req) {
    return {
        username: req.body.username,
        password: req.body.password
    }
}

const _createResponse = function () {
    return {
        status: process.env.HTTP_STATUS_OK,
        message: []
    }
}

const _setResponse = function (response, status, message) {
    response.status = status;
    response.message = message;
}

const userRegister = function (req, res) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)
    const userInfo = _createUser(req, hashedPassword)
    const response = _createResponse();
    Users.create(userInfo).then((newUser) => {
        _setResponse(response, process.env.HTTP_STATUS_OK, newUser)
    })
        .catch((err) => {
            console.log(err);
            _setResponse(response, process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR, err)
        })
        .finally(() => {
            res.status(response.status).json(response.message);
        })
}
const _createLoginUser = function (foundUser) {
    return {
        "username": foundUser[parseInt(process.env.FOUND_USER_GET_INDEX)].username,
        "name": foundUser[parseInt(process.env.FOUND_USER_GET_INDEX)].name
    }
}

const userLogin = function (req, res) {
    const userInfo = _createUserInfo(req)
    const response = _createResponse();
    Users.find({ "username": userInfo.username }).exec().then((foundUser) => {
        if (foundUser.length > parseInt(process.env.FOUND_USER_GET_INDEX)) {
            if (bcrypt.compareSync(userInfo.password, foundUser[parseInt(process.env.FOUND_USER_GET_INDEX)].password)) {
                const user = _createLoginUser(foundUser)
                _setResponse(response, process.env.HTTP_STATUS_OK, { "token": jwt.sign(JSON.stringify(user), process.env.SECRET_OR_PUBLIC_KEY) })
            }
            else {
                _setResponse(response, process.env.HTTP_STATUS_UNAUTHORIZED, { "message": process.env.INVALID_LOGIN });
            }
        }
        else {
            _setResponse(response, process.env.HTTP_STATUS_UNAUTHORIZED, { "message": process.env.INVALID_LOGIN });
        }

    }).catch((err) => {
        console.log(err);
        _setResponse(response, process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR, { "message": err });
    })
        .finally(() => {
            res.status(response.status).json(response.message)
        })
}

const _generateToken = function (name) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({ "name": name }, process.env.SECRET_OR_PUBLIC_KEY, { expiresIn: 3600 })
        resolve(token);
    })
}

module.exports = { userRegister, userLogin }