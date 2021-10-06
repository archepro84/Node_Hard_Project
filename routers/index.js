const express = require("express");
const express_router = express.Router();
const router = require("./router");
const router_post = require("./router_post");
const router_comment = require("./router_comment");
const router_sign = require("./router_sign");
const router_login = require("./router_login");
const router_modify = require("./router_modify");

express_router.use("/api", express.urlencoded({extended: false}), router);
express_router.use("/post", express.urlencoded({extended: false}), router_post);
express_router.use("/comment", express.urlencoded({extended: false}), router_comment)
express_router.use("/sign", express.urlencoded({extended: false}), router_sign)
express_router.use("/login", express.urlencoded({extended: false}), router_login)
express_router.use("/modify", express.urlencoded({extended: false}), router_modify)

module.exports = express_router;