'use strict';

const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const PORT = process.env.PORT || 8080;

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/app.html'));
});

app.get('/hello', (req, res) => {
  // res.set('Content-Type', 'text/plain');
  res.type('text');
  res.send('You visited the hello route!');
});

app.get('/math/circle/:r', (req, res) => {
  res.type('text');
  res.send('The area is ' + req.params.r * req.params.r * Math.PI + ', and the circuference is ' + req.params.r * 2 * Math.PI + '.');
});

app.get('/hello/:month/:day', (req, res) => {
  res.send('Today is ' + req.params.month + '/' + req.params.day);
});

// app.get('/hello', function(req, res) {
//   res.json({'msg' : 'Hello workd!'});
// });
//app.listen(8080);

// for application/x-www-form-urlencoded:
app.use(multer().none()); // requires the 'multer' module

// for application/json:
app.use(express.urlencoded({ extended: true })); // built-in middleware

// for multipart/form-data (required with FormData)
app.use(express.json()); // built-in middleware

app.post('/contact', (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let timestamp = new Date.toUTCString();
});

app.post('/addItem', (req, res) => {
  res.type('text');
  let name = req.body.name;
  let catergory = req.body.category;
  let description = req.body.catergory;
  let image = req.body.image;
  if (!(name && category && description)) {
    res.status(400).send('Missing POST paramter: category, name, and/or description');
  }
  if (!image) {
    image = DEFAULT_IMAGE;
  }
  let result = { 'name' : name, 'description' : description, 'image' : image };
  let dashedCategory = category.toLowerCase().replace(' ', '-');
  let jsonFile = dashedCategory + '-proposals.json';
});


const server = app.listen(PORT, () => console.log('Server ready'));

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
  });
});
// app.listen(PORT);





/*
[ ] node.js
[ ] async/await Promise
[ ] koa.js
[ ] mysql
[ ] sequelize orm
[ ] sql 并发插入/更新优化
*/