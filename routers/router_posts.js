const express = require("express");
const {Posts, sequelize, Sequelize} = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");
const Joi = require("joi");

const router = express.Router();
const postSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
});

const RE_TITLE = /^[a-zA-Z0-9\s\S]{1,40}$/; //게시글 제목 정규 표현식
const RE_HTML_ERROR = /<[\s\S]*?>/; // 게시글 HTML 에러 정규 표현식
const RE_EMPTY = /^[\s]*$/; // 게시글 공백 정규 표현식
const RE_CONTENT = /^[\s\S]{1,3000}$/; // 게시글 내용 정규 표현식


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
            const {title, content} = await postSchema.validateAsync(req.body);
            const {userId} = res.locals.user;

            if (title.search(RE_TITLE) == -1 ||
                title.search(RE_HTML_ERROR) != -1) {
                res.status(412).send({
                    errorMessage: "게시글 제목의 형식이 일치하지 않습니다."
                });
                return;
            } else if (content.search(RE_CONTENT) == -1) {
                res.status(412).send({
                    errorMessage: "게시글 내용의 형식이 일치하지 않습니다."
                });
                return;
            } else if (title.search(RE_EMPTY) != -1 ||
                content.search(RE_EMPTY) != -1) {
                res.status(412).send({
                    errorMessage: "공백으로만 이루어진 게시글은 작성할 수 없습니다."
                });
                return;
            }

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
            const {title, content} = await postSchema.validateAsync(req.body);
            const {userId} = res.locals.user;

            if (title.search(RE_TITLE) == -1 ||
                title.search(RE_HTML_ERROR) != -1) {
                res.status(412).send({
                    errorMessage: "게시글 제목의 형식이 일치하지 않습니다."
                });
                return;
            } else if (content.search(RE_CONTENT) == -1) {
                res.status(412).send({
                    errorMessage: "게시글 내용의 형식이 일치하지 않습니다."
                });
                return;
            } else if (title.search(RE_EMPTY) != -1 ||
                content.search(RE_EMPTY) != -1) {
                res.status(412).send({
                    errorMessage: "공백으로만 이루어진 게시글은 작성할 수 없습니다."
                });
                return;
            }

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
    })
    .delete(authMiddleware, async (req, res) => {
        try {
            const {postId} = req.params;
            console.log(postId);

            res.status(200).send({});
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            res.status(400).send({
                errorMessage: '게시글 수정에 실패하였습니다.',
            });
        }
    })


module.exports = router;