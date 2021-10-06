// $ npx eslint */*.js --fix

module.exports = {
    "env": { // 어떤 환경에서 스크립트를 실행할 것인지 설정한다.
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "indent": ["error", 4], // 들여쓰기를 2칸으로 설정한다.
        "semi": ["error", "always"], // 세미클론을 전부 사용하도록 설정한다.
        "no-unused-vars": 1, // 사용하지 않은 변수는 경고를 발생시킨다.
        "keyword-spacing": 0, //키워드의 앞, 뒤에 띄어쓰기를 사용한다.
    }
};
