var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "ping-pong"
});

connection.connect();

connection.query("SELECT 1 + 1 AS solution", function(err, rows, fields) {
    if (err) throw err;
});

module.exports = {
    getPlayer: function(id) {
        console.log(id);
        return new Promise(function(resolve, reject) {
            connection.query("SELECT * from player where id = " + id, function(
                err,
                rows,
                fields
            ) {
                if (err) throw err;
                resolve(rows[0]);
                return ;
            });
        });
    }
};

// connection.end()
