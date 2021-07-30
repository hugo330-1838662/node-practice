'use strict';

const { time } = require('console');
const express = require('express');
const tdl = express();
const util = require('util');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { OPEN_CREATE } = require('sqlite3');
const DEFAULT_NOTE = "You didn't leave a note."
const DEFAULT_TIME = 'Allday'

const PORT = process.env.PORT || 8080; // localhost port 8080

// var http = require('http');
// var fs = require('fs');
// const { response } = require('express');

// fs.readFile('./app.html', function (err, html) {

//   if (err) throw err;

//   http.createServer(function(request, respons) {
//     response.writeHeader(200, {'Content-Type': 'text/html'});
//     response.write(html);
//     response.end();
//   }).listen(PORT);
// });


// app.get('/hello', function(req, res) {
//   res.type('text').send('Hello World');
// });

tdl.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/to-do-list.html'));
});

tdl.get('/single-day/:day', (req, res) => {
    res.type('text');

    res.send('To-do list for ' + req.params.day.toString().toUpperCase() + '.');
});

tdl.get('/terminate', (req, res) => {
    res.type('text')
    res.send('Terminating...')
    
    process.kill(process.pid, 'SIGTERM');
});
// app.get('/hello', function(req, res) {
//   res.json({'msg' : 'Hello workd!'});
// });
//app.listen(8080);

// for application/x-www-form-urlencoded:
tdl.use(multer().none()); // requires the 'multer' module

// for application/json:
tdl.use(express.urlencoded({ extended: true })); // built-in middleware

// for multipart/form-data (required with FormData)
tdl.use(express.json()); // built-in middleware

// tdl.post('/contact', (req, res) => {
//   let name = req.body.name;
//   let email = req.body.email;
//   let message = req.body.message;
//   let timestamp = new Date.toUTCString();
// });

tdl.post('/addItem', (req, res) => {
  let day = req.body.day;
  let task = req.body.task;
  let note = req.body.note;
  let time = req.body.time;
  if (!(day && task)) {
    res.status(400).send('Missing POST paramter: day and/or task');
  }
  if (!note) {
    note = DEFAULT_NOTE;
  }

  if (!time) {
    time = DEFAULT_TIME;
  }
  // res.json({'day' : day, 'task' : task, 'note' : note});
  console.log({'day' : day, 'time' : time, 'task' : task, 'note' : note});
  console.log('Successfully added');

  res.redirect('/');
});

//let db = new sqlite3.Database(':memory', (err) => {
let db = new sqlite3.Database('./db/tdlist.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});




// (async () => {
  
//   db.run(
//   'CREATE TABLE IF NOT EXISTS tdlist ( \
//   name VARCHAR(83) NOT NULL, \
//   day_code INT NOT NULL REFERENCES week_days(code), \
//   time VARCHAR(2), \
//   note VARCHAR(83));'
//   );

//   db.run('CREATE TABLE IF NOT EXISTS week_days (code INT, weekday VARCHAR(10));');

// })().then(db.run('INSERT INTO week_days VALUES  (1, \'Monday\'), \
// (2, \'Tuesday\'), \
// (3, \'Wednesday\'), \
// (4, \'Thursday\'), \
// (5, \'Friday\'), \
// (6, \'Saturday\'), \
// (7, \'Sunday\');'));

  
db.run(
  'CREATE TABLE IF NOT EXISTS tdlist ( \
  name VARCHAR(83) NOT NULL, \
  day_code INT NOT NULL REFERENCES week_days(code), \
  time VARCHAR(2), \
  note VARCHAR(83));'
);

const dbRunPromise = util.promisify(db.run);

(async () => {
  try {
    await dbRunPromise(
      'CREATE TABLE IF NOT EXISTS week_days (\
        code INT, \
        weekday VARCHAR(10));');
    //, (res, err) => {})
    // db.run('INSERT INTO week_days VALUES  (1, \'Monday\'), \
    // (2, \'Tuesday\'), \
    // (3, \'Wednesday\'), \
    // (4, \'Thursday\'), \
    // (5, \'Friday\'), \
    // (6, \'Saturday\'), \
    // (7, \'Sunday\');');
  } catch (err) {
    console.error(err);
  }
  
})()




const server = tdl.listen(PORT, () => console.log('Server ready'));

process.on('SIGTERM', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });

  server.close(() => {
    console.log('Process terminated')
  });
});