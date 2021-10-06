const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("board")
});

router.get('/error', (req, res) => {
    res.render("error")
});

// write 페이지에 들어간 후 검색하도록 설정
router.get('/write', (req, res) => {
    res.render("write")
});


module.exports = router;