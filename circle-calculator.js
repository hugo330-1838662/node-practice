'use strict';

const express = require('express');
const app = express();

app.get('/math/circle/:r', (req, res) => {
    res.type('text');
    res.send('The area is ' + req.params.r * req.params.r * Math.PI + ', and the circuference is ' + req.params.r * 2 * Math.PI);
});


const PORT = process.env.PORT || 8010;
app.listen(PORT);
