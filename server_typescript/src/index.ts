import SocketIo from "socket.io";
import db from "./lib/db";
import server from "./server";

import Chat from './chatEvents/chat';

const io = SocketIo(server);

export default io;

new Chat().handleChatOps(io);
