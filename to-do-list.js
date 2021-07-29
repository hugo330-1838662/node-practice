'use strict';

const express = require('express');
const tdl = express();
const multer = require('multer');
const path = require('path');
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
    res.send('To-do list for ' + req.params.day.toUpperCase + '.');
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

tdl.post('/contact', (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let timestamp = new Date.toUTCString();
});

tdl.post('/addItem', (req, res) => {
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


const server = tdl.listen(PORT, () => console.log('Server ready'));

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
  });
});