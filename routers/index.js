const express = require("express");
const router = express.Router();

const router_users = require("./router_users");
const router_posts = require("./router_posts");
const router_comments = require("./router_comments");
const router_sign = require("./router_sign");
const router_login = require("./router_login");

router.use("/users", router_users);
router.use("/posts", router_posts);
router.use("/comments", router_comments);
router.use("/sign", router_sign);
router.use("/login", router_login);

module.exports = router;