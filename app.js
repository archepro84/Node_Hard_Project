const express = require("express");
const Http = require("http");
const nunjucks = require("nunjucks");
const express_router = require("./routers");
const express_render = require('./renders');

const app = express();
const http = Http.createServer(app);

// nunjucks 템플릿 언어 선언
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/', express_render); //Render 폴더 적용
app.use('/api', express_router); //Router 폴더 적용
app.use(express.static("assets")); // assets 폴더 공유

module.exports = http;