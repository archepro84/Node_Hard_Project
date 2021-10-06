const jwt = require("jsonwebtoken");
const {Users} = require("../models");
const tokenKey = "weekly4_Project_key";

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
        Users.findByPk(userId)
            .then((user) => {
                res.locals.user = user['dataValues'];
                next();
            });
    } catch (err) {
        res.locals.user = {userId: undefined};
        next();
    }
};