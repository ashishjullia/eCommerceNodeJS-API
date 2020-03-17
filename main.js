const http = require('http');
const bodyParser = require('body-parser');
const product = require('./models/ProductModel.js');
const mongoose = require('mongoose');
require('dotenv/config');

// Express prepared
const expressInstance = require('express');
const express = new expressInstance();
const server = http.createServer(express);

// Server created
server.listen(8081, '0.0.0.0', function() {
    var addr = server.address();
    console.log(`Node is listening on -> ${addr.address}:${addr.port}`);
});

// Create a database connection
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true }, () => 
    console.log('Connected to DB')
);


// Make our app use the body-parser
express.use(bodyParser.json());

// Import Routes
// Middlewares
const postRoute = require('./routes/productRoute');
express.use('/Products', postRoute);