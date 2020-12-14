const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./config/routes');
var https = require('https');
const fs = require('fs');
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
const app = express();
const config = require('./config/env/index');
const port = config.port;
var credentials = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};
// const httpsServer = https.createServer(credentials, app);





app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(routes);

connect();

function listen() {
    // console.log(credentials);
    // https.createServer(credentials, app).listen(port, () => console.log(`server is listening on port ${port}`));
    app.listen(port, () => console.log(`server is listening on port ${port}`));
}

function connect() {
    mongoose.connect(config.dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.on('error', err => console.log(err));
    db.once('open', listen);
}


