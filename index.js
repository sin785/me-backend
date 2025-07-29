// https://expressjs.com/en/resources/middleware/cors.html

// require('dotenv').config()

// var express = require('express')
// var cors = require('cors')
// const mysql = require('mysql2');


// // Create the connection to database
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE
// });


// var app = express()

// app.use(cors())

// app.get('/', function (req, res, next) {
//   res.json({msg: 'Home Page'})
// })


// app.get('/helloworld', function (req, res, next) {
//   res.json({msg: 'helloword'})
// })

// app.get('/users', function (req, res, next) {
  
//   // A simple SELECT query
//   connection.query(
//     'SELECT * FROM `users`',
//     function (err, results, fields) {
//       res.json(results);
//       console.log(results); // results contains rows returned by server
//       console.log(fields); // fields contains extra meta data about results, if available
//     }
//   );


// })

// app.listen(5000, function () {
//   console.log('CORS-enabled web server listening on port 5000')
// })


//
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

let connection;

function connectWithRetry(attempt = 1) {
  console.log(`Attempting to connect to MySQL (attempt ${attempt})...`);

  connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error(`MySQL connection failed: ${err.message}`);
      setTimeout(() => connectWithRetry(attempt + 1), 2000); // Retry after 2 seconds
    } else {
      console.log('Connected to MySQL!');
      startServer();
    }
  });

  connection.on('error', (err) => {
    console.error('MySQL runtime error:', err.message);
  });
}

function startServer() {
  app.get('/', (req, res) => {
    res.json({ msg: 'Home Page' });
  });

  app.get('/helloworld', (req, res) => {
    res.json({ msg: 'helloworld' });
  });

  app.get('/users', (req, res) => {
    connection.query('SELECT * FROM `users`', (err, results) => {
      if (err) {
        console.error("Query error:", err.message);
        return res.status(500).json({ error: 'Query failed' });
      }
      res.json(results);
    });
  });

  app.listen(5000, () => {
    console.log('Express server listening on port 5000');
  });
}

// Start connecting
connectWithRetry();