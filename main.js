const http = require('http');
const product = require('./models/Product.js');
const db = require('./dbConnect.js');
db.init();

const expressInstance = require('express');
const express = new expressInstance();
const server = http.createServer(express);

server.listen(8081, '0.0.0.0', function() {
    var addr = server.address();
    console.log(`Node is listening on -> ${addr.address}:${addr.port}`);
});