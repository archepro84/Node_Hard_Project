const http = require("./app");
require('dotenv').config();

http.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Start listen Server `);
});

