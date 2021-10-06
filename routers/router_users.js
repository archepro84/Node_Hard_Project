const express = require("express");
const Joi = require("joi");

const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const {user} = res.locals;
        res.send({user});
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send(
            {errorMessage: "사용자 정보를 가져오지 못하였습니다."}
        );
        return;
    }
});

module.exports = router;