const express = require("express");
const Joi = require("joi");
const {Users, Posts, Comments, sequelize, Sequelize} = require("../models");
const {Op} = require("sequelize");
const jwt = require("jsonwebtoken");
const path = require("path")

const router = express.Router();
const authMiddleware = require("../middlewares/auth_middleware");
const authUserMiddleware = require("../middlewares/authUserMiddleware");

router.get('/:postId', authUserMiddleware, async (req, res) => {
    try {
        const {postId} = req.params
        const {userId} = res.locals.user;

        const userId_join = `SELECT c.commentId,c.userId, u.nickname, c.comment, c.createdAt, c.updatedAt
            FROM Comments AS c
            JOIN Users AS u
            ON c.userId = u.userId 
            WHERE c.postId = ${postId}
            Order By c.createdAt DESC`;

        const comments = await sequelize.query(userId_join, {type: Sequelize.QueryTypes.SELECT})
        res.send({comments, userId});
        return;

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send(
            {errorMessage: ""}
        )
    }
});

router.post('/:postId', authMiddleware, async (req, res) => {
    try {
        const {postId} = req.params;
        const {comment} = req.body;
        const {userId} = res.locals.user
        console.log(postId, comment, userId);

        if (!comment) {
            res.status(412).send({
                errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
            });
            return;
        }

        await Comments.create({postId, userId, comment});
        res.send("Clear")
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send(
            {errorMessage: "댓글 작성에 실패하였습니다."}
        )
    }
});

router.patch('/:commentId', authMiddleware, async (req, res) => {
    const {commentId} = req.params;
    const {comment} = req.body;
    const {userId} = res.locals.user;
    console.log(commentId, comment, userId);
    // console.log(commentId, comment);

    await Comments.update(
        {comment},
        {
            where: {
                commentId, userId
            }
        }
    )
        .then((updateCount) => {
            if (updateCount < 1) {
                res.status(400).send({
                        errorMessage: "수정이 정상적으로 처리되지 않았습니다."
                    }
                )
            } else {
                res.send({})
            }
        })
});

router.delete('/:commentId', authMiddleware, async (req, res) => {
    const {commentId} = req.params;
    const {userId} = res.locals.user;
    console.log(commentId, userId);

    await Comments.destroy(
        {
            where: {
                commentId, userId
            }
        }
    )
        .then((updateCount) => {
            if (updateCount < 1) {
                res.status(400).send({
                        errorMessage: "수정이 정상적으로 처리되지 않았습니다."
                    }
                )
            } else {
                res.send({})
            }
        })
});


module.exports = router