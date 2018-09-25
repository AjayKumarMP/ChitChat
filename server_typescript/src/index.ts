import server from './server';  

const io = require('socket.io')(server);

export default io;

