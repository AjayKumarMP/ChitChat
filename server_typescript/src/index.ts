import server from './server';
import socketIo from 'socket.io';



const io = socketIo(server);

export default io;

