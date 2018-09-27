import express from 'express'
const app = express();
import http from 'http';
const server = http.createServer(app);
import path from 'path';

import config from './config/env';

app.use(express.static(__dirname + '../public/'));
app.use('/chitChat', express.static(path.resolve("public/index.html")));

server.listen(config.port, config.host, () => {
    console.log(`server running at ${config.host}: ${config.port} in ${config.env}`);
});

export default server;