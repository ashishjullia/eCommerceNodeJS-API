const http = require('http');
const bodyParser = require('body-parser');
const product = require('./models/ProductModel.js');
const mongoose = require('mongoose');
require('dotenv/config');
const session = require('express-session');

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
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => 
    console.log('Connected to DB')
);

// Make our app use the body-parser
express.use(bodyParser.json());


// Import Routes & register them as "middleware"
// Middlewares

const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoute');
const addressRoute = require('./routes/addressRoute');
const checkoutRoute = require('./routes/checkoutRoute');

express.use(session({
    secret: "secret",
    saveUninitialized: false,
    resave: true
}))

express.use('/Users', userRoute);
express.use('/Products', productRoute);
express.use('/Cart', cartRoute);
express.use('/Address', addressRoute);
express.use('/Checkout', checkoutRoute);