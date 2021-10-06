const express = require('express');
const {Posts} = require("../models");
const router = express.Router();

router.get('/', (req, res) => {
    try {
        res.render("board");
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.render('error');
    }
});

router.get('/login', (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.render('error');
    }
});

router.get('/sign', (req, res) => {
    try {
        res.render("sign");
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.render('error');
    }
});

router.get('/error', (req, res) => {
    try {
        res.render("error");
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(404).send(
            {errorMessage: "Html 파일을 찾을 수 없습니다."}
        );
    }
});

router.get('/write', (req, res) => {
    try {
        res.render("write");
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.render('error');
    }
});

router.get('/posts/:postId', async (req, res) => {
    try {
        const {postId} = req.params;
        const post = await Posts.findByPk(postId)
            .then((posts) => {
                return posts['dataValues'];
            });
        res.render("post", {post});
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.render('error');
    }
});

router.get('/modify/:postId', async (req, res) => {
    try {
        const {postId} = req.params;
        const post = await Posts.findByPk(postId)
            .then((posts) => {
                return posts['dataValues'];
            });
        res.render("modify", {post});
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.render('error');
    }
});


module.exports = router;