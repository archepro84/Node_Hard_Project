const express = require('express');
const {Posts} = require("../models");
const router = express.Router();

router.get('/', (req, res) => {
    try {
        res.render("board")
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.render('error');
    }
});

router.get('/error', (req, res) => {
    res.render("error")
});

// write 페이지에 들어간 후 검색하도록 설정
router.get('/write', (req, res) => {
    try {
        res.render("write")
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.render('error');
    }
});

router.get('/post/:postId', async (req, res) => {
    try {
        const {postId} = req.params;
        const post = await Posts.findByPk(postId)
            .then((posts) => {
                return posts['dataValues']
            });
        res.render("post", {post})
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.render('error');
    }
});


module.exports = router;