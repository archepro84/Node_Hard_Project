const express = require("express");
const Joi = require("joi");
const {Users, Posts, Comments} = require("../models");
const {Op} = require("sequelize");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const router = express.Router();
const authMiddleware = require("../middlewares/auth_middleware");
const connection = require("../assets/mySqlLib")

// TODO router에 전역변수로 암호화 키값을 넣어줘도 괜찮을까?
const tokenKey = "weekly4_Project_key"


router.get('/', (req, res) => {
    res.render("login")
});

const loginSchema = Joi.object({
    nickname: Joi.string().required(),
    password: Joi.string().required(),
})

router.post('/', async (req, res) => {
    try {
        // console.log(req.body);
        // console.log(req.body.nickname);
        const {nickname, password} = await loginSchema.validateAsync(req.body);
        // console.log(`Hello nickname : ${nickname}, password : ${password}`);

        // console.log("HEllo");
        // console.log(nickname, password);
        const user = await Users.findOne({
            where: {
                [Op.and]: [{nickname}, {password}]
            }
        })


        if (user.length == 0) {
            res.status(412).send({
                errorMessage: "닉네임 또는 패스워드를 확인해주세요"
            });
            return;
        }
        const token = jwt.sign({userId: user.userId}, tokenKey)
        res.send({token})

    } catch (err) {
        res.status(400).send({
            errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
        });
    }
});

module.exports = router