const express = require('express');
require('dotenv').config();

const userController = require("../controllers/users.controller");
const router = express.Router();

router.route(process.env.USER_REGISTER_URL).post(userController.userRegister);

router.route(process.env.USER_LOGIN_URL).post(userController.userLogin);

module.exports = router;
