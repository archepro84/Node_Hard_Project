const express = require("express");
const express_router = express.Router();
const router = require("./router");
const router_post = require("./router_post");
const router_comment = require("./router_comment");
const router_sign = require("./router_sign");
const router_login = require("./router_login");

express_router.use("/api", express.urlencoded({extended: false}), router);
express_router.use("/api/posts", express.urlencoded({extended: false}), router_post);
express_router.use("/api/comments", express.urlencoded({extended: false}), router_comment);
express_router.use("/api/sign", express.urlencoded({extended: false}), router_sign);
express_router.use("/api/login", express.urlencoded({extended: false}), router_login);

module.exports = express_router;