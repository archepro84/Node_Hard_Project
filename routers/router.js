const express = require("express");
const Joi = require("joi");
const {Users, Posts, Comments} = require("../models");
const {Op} = require("sequelize");
const jwt = require("jsonwebtoken");
const connection = require("../assets/mySqlLib");

const router = express.Router();
const authMiddleware = require("../middlewares/auth_middleware");

router.get('/users/me', authMiddleware, async (req, res) => {
    const {user} = res.locals;
    res.send({user})
});

module.exports = router;