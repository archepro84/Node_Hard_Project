const express = require("express");
const Joi = require("joi");
const {Users, Posts, Comments, sequelize, Sequelize} = require("../models");
const jwt = require("jsonwebtoken");

const router = express.Router();
const authMiddleware = require("../middlewares/auth_middleware");


router.get('/posts', async (req, res) => {
    const userId_join = `SELECT p.postId, p.userId, u.nickname, p.title, p.content, p.createdAt, p.updatedAt
        FROM Posts AS p
        JOIN Users AS u
        ON p.userId = u.userId
        ORDER BY p.postId DESC`;

    const posts = await sequelize.query(userId_join, {type: Sequelize.QueryTypes.SELECT})
    // if (!Object.keys(posts).length) {
    //     res.status(400).send(
    //         {errorMessage: "Posts 값들이 존재하지 않습니다."}
    //     )
    //     return;
    // }
    res.status(200).send({posts});
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const {title, content} = req.body;
        const {userId} = res.locals.user

        await Posts.create({userId, title, content})
        res.send({result: "성공적이였습니다."})
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send(
            {errorMessage: "게시글 작성에 실패하였습니다."}
        )
    }
});

router.get('/:postId', async (req, res) => {
    //TODO 자기자신의 userId는 어떠한 방식으로 알 수 있을까?
    const {postId} = req.params;
    const post = await Posts.findByPk(postId)
        .then((posts) => {
            return posts['dataValues']
        });
    // console.log(post);
    res.render("post", {post})
});


module.exports = router