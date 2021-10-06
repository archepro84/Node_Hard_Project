const express = require("express");
const {Comments, sequelize, Sequelize} = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");
const authUserMiddleware = require("../middlewares/authUserMiddleware");

const router = express.Router();


router.route('/:postId')
    .get(authUserMiddleware, async (req, res) => {
        try {
            const {postId} = req.params;
            const {userId} = res.locals.user;

            const userId_join = `
                SELECT c.commentId,c.userId, u.nickname, c.comment, c.createdAt, c.updatedAt
                FROM Comments AS c
                JOIN Users AS u
                ON c.userId = u.userId 
                WHERE c.postId = ${postId}
                Order By c.createdAt DESC`;

            await sequelize.query(userId_join, {type: Sequelize.QueryTypes.SELECT})
                .then(comments => {
                    res.status(200).send({comments, userId});
                });
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send(
                {errorMessage: "댓글 조회에 실패하였습니다."}
            );
        }
    })

    .post(authMiddleware, async (req, res) => {
        try {
            const {postId} = req.params;
            const {comment} = req.body;
            const {userId} = res.locals.user;

            if (!comment) {
                res.status(412).send({
                    errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
                });
                return;
            }

            await Comments.create({postId, userId, comment});
            res.status(201).send({});
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send(
                {errorMessage: "댓글 작성에 실패하였습니다."}
            );
        }
    });

router.route('/:commentId')
    .patch(authMiddleware, async (req, res) => {
        try {
            const {commentId} = req.params;
            const {comment} = req.body;
            const {userId} = res.locals.user;

            const updateCount = await Comments.update(
                {comment},
                {where: {commentId, userId}}
            );
            if (updateCount < 1) {
                res.status(400).send(
                    {errorMessage: "댓글 수정이 정상적으로 처리되지 않았습니다."}
                );
                return;
            }
            res.status(200).send({});
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send(
                {errorMessage: "댓글 수정에 실패하였습니다."}
            );
        }
    })
    .delete(authMiddleware, async (req, res) => {
        try {
            const {commentId} = req.params;
            const {userId} = res.locals.user;

            const updateCount = await Comments.destroy(
                {where: {commentId, userId}}
            );

            if (updateCount < 1) {
                res.status(400).send(
                    {errorMessage: "댓글 삭제가 정상적으로 처리되지 않았습니다."}
                );
                return;
            }
            res.status(200).send({});
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send(
                {errorMessage: "댓글 삭제에 실패하였습니다."}
            );
        }
    });


module.exports = router;