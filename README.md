# Node_Hard_Project
항해99 Node.js 심화주차 프로젝트입니다.



## 실행방법
``` shell
$ npm install express dotenv joi sequelize sequelize-cli mysql2 nunjucks jsonwebtoken chokidar
$ npx sequelize db:create
$ npx sequelize db:migrate
$ node server.js
```

## .env 파일 환경변수 목록
![envFile 작성법](https://user-images.githubusercontent.com/49636918/136246255-30d194a8-8265-41a2-b917-af5eeac2c9f8.png)  
server.js 파일이 있는 위치에 .env 파일을 만들어 해당하는 환경 변수를 작성해야합니다.


## DB ERD
![노드 심화 프로젝트 DB ERD](https://user-images.githubusercontent.com/49636918/136245920-033f614a-5b77-42c5-b021-173a7ce56b27.png)


## MySQL Create Table Query
``` sql
CREATE TABLE Users(
    userId int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nickname varchar(255) NOT NULL UNIQUE,
    password varchar(255),
    createdAt datetime NOT NULL DEFAULT NOW(),
    updatedAt datetime NOT NULL DEFAULT NOW()
);

CREATE TABLE Posts(
    postId int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId int(11) NOT NULL,
    title varchar(255),
    content varchar(3000),
    createdAt datetime NOT NULL DEFAULT NOW(),
    updatedAt datetime NOT NULL DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);


CREATE TABLE Comments(
    commentId int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    postId int(11) NOT NULL, 
    userId int(11) NOT NULL, 
    comment varchar(255), 
    createdAt datetime NOT NULL DEFAULT NOW(),
    updatedAt datetime NOT NULL DEFAULT NOW(),
    FOREIGN KEY (postId) REFERENCES Posts(postId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);
```
