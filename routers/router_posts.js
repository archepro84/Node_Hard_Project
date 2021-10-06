const express = require("express");
const {Posts, sequelize, Sequelize} = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const userId_join = `
            SELECT p.postId, p.userId, u.nickname, p.title, p.content, p.createdAt, p.updatedAt
            FROM Posts AS p
            JOIN Users AS u
            ON p.userId = u.userId
            ORDER BY p.postId DESC`;

            const posts = await sequelize.query(userId_join, {type: Sequelize.QueryTypes.SELECT});

            res.status(200).send({posts});
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send(
                {errorMessage: "게시글 조회에 실패하였습니다."}
            );
        }
    })
    .post(authMiddleware, async (req, res) => {
        try {
            const {title, content} = req.body;
            const {userId} = res.locals.user;

            await Posts.create({userId, title, content});
            res.status(201).send({result: "게시글 작성에 성공하였습니다."});
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send(
                {errorMessage: "게시글 작성에 실패하였습니다."}
            );
        }
    });


router.route('/:postId')
    .patch(authMiddleware, async (req, res) => {
        try {
            const {postId} = req.params;
            const {title, content} = req.body;
            const {userId} = res.locals.user;

            const updateCount = await Posts.update(
                {title, content},
                {where: {postId, userId}});

            if (updateCount < 1) {
                res.status(401).send({errorMessage: "정상적으로 수정되지 않았습니다."});
                return;
            }
            res.status(200).send({});
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: '게시글 수정에 실패하였습니다.',
            });
        }
    });



module.exports = router;