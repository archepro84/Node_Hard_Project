const express = require("express");
const Joi = require("joi");
const {Users, Posts, Comments} = require("../models");
const {Op} = require("sequelize");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const router = express.Router();
const authMiddleware = require("../middlewares/auth_middleware");
const connection = require("../assets/mySqlLib")


router.get('/', (req, res) => {
    res.render("sign")
});

const userSchema = Joi.object({
    nickname: Joi.string().required(),
    password: Joi.string().required(),
    confirm: Joi.string(),
})

// TODO SQL인젝션에 관련된 필터를 할 수 없을까?
router.post('/', async (req, res) => {
    try {
        // console.log(req.body);
        // console.log(req.body['Hello']);
        // console.log(req);

        //시작과 끝이 a-zA-Z0-9글자로 3 ~ 255개의 단어로 구성되어야 한다.
        const re_nickname = /^[a-zA-Z0-9]{3,255}$/;
        const re_password = /^[a-zA-Z0-9]{4,255}$/;

        const {nickname, password, confirm} = await userSchema.validateAsync(req.body)
        console.log(nickname, password);

        if (password !== confirm) {
            res.status(412).send({
                errorMessage: "패스워드가 일치하지 않습니다."
            });
            return;
        }
        if (nickname.search(re_nickname) == -1) {
            res.status(412).send({
                errorMessage: "ID의 형식이 일치하지 않습니다."
            });
            return;
        }
        if (password.search(re_password) == -1) {
            res.status(412).send({
                errorMessage: "패스워드 형식이 일치하지 않습니다."
            });
            return;
        }
        if (password.search(nickname) != -1) {
            res.status(412).send({
                errorMessage: "패스워드에 닉네임이 포함되어 있습니다."
            });
            return;
        }
        console.log("Hello");
        const user = await Users.findAll({
            where: {nickname}
            // [Op.or]: [{nickname}],
        })

        if (user.length) {
            res.status(412).send({
                errorMessage: "중복된 닉네임입니다."
            });
            return;
        }
        //CreateAt 과 UpdateAt을 지정해주지 않아도 자동으로 값이 입력된다.
        await Users.create({nickname, password})
        console.log(`${nickname} 님이 가입하셨습니다.`);
        res.status(200).send({result: "Clear"})
    } catch (err) {
        console.error(err);
        res.status(400).send({
            errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
        });
    }
});


module.exports = router