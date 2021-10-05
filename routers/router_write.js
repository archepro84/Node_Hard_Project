const express = require("express");
const Joi = require("joi");
const {Users, Posts, Comments} = require("../models");
const {Op} = require("sequelize");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const router = express.Router();
const authMiddleware = require("../middlewares/auth_middleware");
const connection = require("../assets/mySqlLib")


// write 페이지에 들어간 후 검색하도록 설정
router.get('/', (req, res) => {
    res.render("write")
});


router.post('/post', authMiddleware, async (req, res) => {
    const {title, content} = req.body;
    const {userId} = res.locals.user

    await Posts.create({userId, title, content})
    res.send({result: "성공적이였습니다."})
});


router.post('/comment/:postId', authMiddleware, async (req, res) => {
    const {postId} = req.params;
    const {comment} = req.body;
    const {userId} = res.locals.user
    console.log(postId, comment, userId);


    if (!comment) {
        res.status(400).send({
            errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
        });
        return;
    }

    await Comments.create({postId, userId, comment});
    res.send("Clear")
});

module.exports = router