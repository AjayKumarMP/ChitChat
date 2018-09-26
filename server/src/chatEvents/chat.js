const User = require('../models/user');
const { loginUser, registreUser, logoutUser, verifyAuth } = require('../service/authService');
const { getAllUsers, sendMessages, joinRoom } = require('../service/chatService');
const logger = require('../lib/logger');

var checkLoggedInStatus = (socket , callback)=>{
    if(socket.loggedIn && socket.userId){
        return;
    }
    callback({auth: false, message: "Authentication Error"});
}

module.exports = {
    checkLoggedInStatus,

    handleChatOps: (io) => {
        tempIo = io;
        io.on('connection', (socket) => {
            socket.loggedIn = false;
            logger.info("New User conneced");
            console.log("New User conneced");

            socket.on("verify-auth", async (data, callback) => {
                await verifyAuth(data.token, socket, callback, io);
            });

            socket.on('login', async (user, callback) => {
                await loginUser(user, socket, callback, io);
            });

            socket.on('logout', async () => {
                logoutUser(socket, io);
            });

            socket.on('register', async (user, callback) => {
                await registreUser(user, callback, socket.id, io);
            });

            socket.on('disconnect', () => {
                console.log("user Got disconnected",socket.userId)
                logoutUser(socket, io);
            });

            socket.on('getAllUsers', async (callback) => {
                checkLoggedInStatus(socket, callback);
                await getAllUsers(socket, callback);
            });

            socket.on("sendMessage", async (data, callback) => {
                checkLoggedInStatus(socket, callback);
                // console.log("inside send message",data);
                await sendMessages(data.message, socket, data.to, callback);
            });

            socket.on("joinRoom", async (data, callback)=>{
                checkLoggedInStatus(socket, callback);
                joinRoom(data.room, data.member, socket, callback);
            });

        });
    },

}

