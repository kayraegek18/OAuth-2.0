const mysql = require("mysql2/promise");

let connection;

(async () => {
    connection = await mysql.createConnection({
        host: "45.151.2.104",
        port: 3306,
        user: "root",
        password: "Emre1981!",
        database: "mineala",
        maxIdle: Infinity,
        idleTimeout: Infinity
    });
    setInterval(async () => {
         await connection.execute("SELECT 1;");
    }, 10 * 1000);
    console.log("Connected")
})();

function query(sql, values) {
    return new Promise(async (resolve, reject) => {
        const [rows] = await connection.execute(sql, values);
        resolve(rows);
    });
    /*return new Promise(async (resolve, reject) => {
        const connection = await mysql.createConnection({
            host: "45.151.2.104",
            port: 3306,
            user: "root",
            password: "Emre1981!",
            database: "kiyovm"
        });
        const [rows] = await connection.execute(sql, values);
        await connection.end();
        resolve(rows);
    });*/
}

module.exports = {
    query
}