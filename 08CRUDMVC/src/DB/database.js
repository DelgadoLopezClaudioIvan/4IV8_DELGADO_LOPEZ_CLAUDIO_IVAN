const mysql = require('mysql2');

//creamos la conexion

const pool = mysql.createPool({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : 'root',
    database : 'practicacrud',
    waitForConnections : true,
    connectionLimit : 10,
    queueLimit : 0
});

//la exportamos para poder usuarla
module.exports = pool.promise();