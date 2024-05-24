const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'db_admin',
  password: 'abcd',
  database: 'project_db'
});

connection.connect();

connection.end();
