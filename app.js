const express = require("express")
const Http = require("http");
const socketIo = require("socket.io");
const router = require("./routers/router");
const router_post = require("./routers/router_post")
const router_comment = require("./routers/router_comment")
const router_write = require("./routers/router_write")
const router_login = require("./routers/router_login")
const router_sign = require("./routers/router_sign")
const router_modify = require("./routers/router_modify")

const nunjucks = require("nunjucks");

const app = express();
const http = Http.createServer(app);

app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
})

app.get('/', (req, res) => {
    res.render("board")
});

app.get('/error', (req, res) => {
    res.render("error")
});

app.use("/api", express.urlencoded({extended: false}), router);
app.use("/post", express.urlencoded({extended: false}), router_post);
app.use("/comment", express.urlencoded({extended: false}), router_comment)
app.use("/write", express.urlencoded({extended: false}), router_write)
app.use("/sign", express.urlencoded({extended: false}), router_sign)
app.use("/login", express.urlencoded({extended: false}), router_login)
app.use("/modify", express.urlencoded({extended: false}), router_modify)

app.use(express.static("assets"));



module.exports = http