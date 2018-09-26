const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');

const db = require('./lib/db');
const { handleChatOps } = require('./chatEvents/chat');

app.use(express.static(__dirname + '../public/'));
app.use('/chitChat', express.static(path.resolve("public/index.html")));
const config = require('../config/env');

server.listen(config.port, config.host, () => {
    console.log(`server running at ${config.host}: ${config.port} in ${config.env}`);
});

handleChatOps(io);

module.exports = io;