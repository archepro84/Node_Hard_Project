const express = require("express");
const Joi = require("joi");
const {Users, Posts, Comments} = require("../models");
const {Op} = require("sequelize");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const router = express.Router();
const authMiddleware = require("../middlewares/auth_middleware");
const connection = require("../assets/mySqlLib")


router.get('/false', async (req, res) => {
    const {bool} = req.query;
    if (bool)
        res.status(200).send()
    else
        res.status(401).send({})
});

router.get('/sign', async (req, res) => {
    const [localPart, domain, ...etc] = value.split('@');
    // console.log(etc);
    const email = (value || '');
    //etc.length : @가 여러개 존재한다는 뜻
    if (!localPart || !domain || etc.length) {
        res.status(401).send({})
    } else if (email.includes(' ')) {
        res.status(401).send({})
    } else if (email[0] === '-') {
        res.status(401).send({})
    } else if (!/^[a-z0-9+_-]+$/gi.test(localPart)) {
        res.status(401).send({})
    } else if (!/^[a-z0-9.-]+$/gi.test(domain)) {
        res.status(401).send({})
    }
    res.send()
});


module.exports = router