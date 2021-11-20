const express = require("express");
const Joi = require("joi");
const {Users, sequelize, Sequelize} = require("../models");

const router = express.Router();

const userSchema = Joi.object({
    nickname: Joi.string().required(),
    password: Joi.string().required(),
    confirm: Joi.string(),
});

router.post('/', async (req, res) => {
    try {
        //닉네임의 시작과 끝이 a-zA-Z0-9글자로 3 ~ 10 단어로 구성되어야 한다.
        const re_nickname = /^[a-zA-Z0-9]{3,10}$/;
        const re_password = /^[a-zA-Z0-9]{4,30}$/;

        const {nickname, password, confirm} = await userSchema.validateAsync(req.body);

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
        const user = await Users.findAll({
            attributes: ['userId'],
            where: {nickname}
        });

        if (user.length) {
            res.status(412).send({
                errorMessage: "중복된 닉네임입니다."
            });
            return;
        }
        //CreateAt 과 UpdateAt을 지정해주지 않아도 자동으로 값이 입력된다.
        await Users.create({nickname, password});
        console.log(`${nickname} 님이 가입하셨습니다.`);

        res.status(201).send({result: "Clear"});
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send({
            errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
        });
    }
});


module.exports = router;