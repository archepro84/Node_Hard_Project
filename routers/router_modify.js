const express = require("express");
const Joi = require("joi");
const {Users, Posts, Comments} = require("../models");

const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");


router.patch('/:postId', authMiddleware, async (req, res) => {
    const {postId} = req.params;
    const {title, content} = req.body;
    const {userId} = res.locals.user;
    console.log(postId, title, content, userId);

    await Posts.update(
        {title, content},
        {
            where: {postId, userId}
        }
    ).then((updateCount) => {
        if (updateCount < 1) {
            res.status(401).send({errorMessage: "정상적으로 수정되지 않았습니다."});
            return;
        } else {
            res.send({});
        }
    });


});


module.exports = router;