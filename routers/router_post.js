const express = require("express");
const Joi = require("joi");
const {Users, Posts, Comments, sequelize, Sequelize} = require("../models");
const {Op} = require("sequelize");
const jwt = require("jsonwebtoken");
const path = require("path")

const router = express.Router();
const authMiddleware = require("../middlewares/auth_middleware");
const connection = require("../assets/mySqlLib")


router.get('/posts', async (req, res) => {
    // // 앞에 10개는 받환받지 않고 넘긴 뒤 2개의 항목만 반환한다.
    // Project.findAll({ offset: 10, limit: 2 })
    console.log(req.query);

    const userId_join = `SELECT p.postId, p.userId, u.nickname, p.title, p.content, p.createdAt, p.updatedAt
        FROM Posts AS p
        JOIN Users AS u
        ON p.userId = u.userId
        Order By p.postId DESC`;

    await sequelize.query(userId_join, {type: Sequelize.QueryTypes.SELECT})
        .then((posts) => {
            console.log(posts);
            res.send({posts});
        })

    // connection.query(userId_join, function (error, posts, fields) {
    //     console.log(posts);
    //     if (error) {
    //         console.log(error);
    //         res.status(400).send(
    //             {errorMessage: "Posts 값들이 존재하지 않습니다."}
    //         )
    //         return;
    //     }
    //     res.send({posts})
    // });
});

router.get('/:postId', async (req, res) => {
    //TODO 자기자신의 userId는 어떠한 방식으로 알 수 있을까?
    const postId = req.params.postId;
    const post = await Posts.findByPk(postId)
        .then((posts) => {
            return posts['dataValues']
        });

    res.render("post", {post})
});


module.exports = router