const express = require("express");
const Joi = require("joi");
const {Users, Posts, Comments} = require("../models");
const {Op} = require("sequelize");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const path = require("path")

const router = express.Router();
const authMiddleware = require("../middlewares/auth_middleware");
const connection = require("../assets/mySqlLib");

// TODO router에 전역변수로 암호화 키값을 넣어줘도 괜찮을까?
const tokenKey = "weekly4_Project_key"

function getUserId(token) {
    try {
        // TODO tokenKey로 검출된 데이터는 정상적인 데이터라고 가정한다.
        const {userId} = jwt.verify(token, tokenKey);
        return userId
    } catch {
        return false;
    }
}

// TODO get 방식으로는 token의 길이를 전부 수신하지 못하기 때문에 Post로 설정함
router.post('/:postId', async (req, res) => {
    const {postId} = req.params
    const {token} = req.body;

    const userId_join = `SELECT c.commentId,c.userId, u.nickname, c.comment, c.createdAt, c.updatedAt
    FROM Comments AS c
    JOIN Users AS u
    ON c.userId = u.userId AND c.postId = ${postId}
    Order By c.createdAt DESC`;

    connection.query(userId_join, function (error, comments, fields) {
        if (error) {
            console.log(error);
            res.status(400).send({
                    errorMessage: "Comments 값들이 존재하지 않습니다."
                }
            )
            return;
        }
        //함수가 복잡해지기는 하지만 1번의 통신으로 token값을 가져오기 위해 사용해본다.
        if (token) {
            const userId = getUserId(token);
            res.send({comments, userId})
            return;
        }
        res.send({comments})
    });
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

// TODO 미들웨어에서 들어온 res.locals.user가 다른 유저로인해 교체된다면?
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