const jwt = require("jsonwebtoken");
const {Users} = require("../models");
const tokenKey = "weekly4_Project_key"

module.exports = (req, res, next) => {
    try {
        const {authorization} = req.headers;
        const [tokenType, tokenValue] = authorization.split(' ');
        if (tokenType !== 'Bearer') {
            res.status(401).send({
                errorMessage: "로그인 후 사용하세요.",
            });
            return;
        }
        const {userId} = jwt.verify(tokenValue, tokenKey);
        //promise
        Users.findByPk(userId)
            .then((user) => {
                res.locals.user = user;
                //Promise 이므로 next를 사용하여 다음 미들웨어로 넘긴다.
                next();
            });
    } catch (err) {
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요.",
        });
        return;
    }
}