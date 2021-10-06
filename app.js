const express = require("express")
const Http = require("http");
const nunjucks = require("nunjucks");
const express_router = require("./routers");
const express_render = require('./renders');

const app = express();
const http = Http.createServer(app);


app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
})

app.use('/', express_render);
app.use('/', express_router);
app.use(express.static("assets"));


module.exports = http