const User = require('../models/user');
const { loginUser, registreUser, logoutUser } = require('../service/authService');
const { getAllUsers, sendMessages } = require('../service/chatService');
const logger = require('../lib/logger');

module.exports = {

    handleChatOps: (io) => {
        var users = [];
        io.on('connection', (socket) => {

            logger.info("New User conneced");
            console.log("New User conneced");

            socket.on('login', async (user, callback) => {
                await loginUser(user, socket, callback);
            });

            socket.on('logout', async () => {
                logoutUser(socket);
            });

            socket.on('register', async (user, callback) => {
                await registreUser(user, callback, socket.id);
            });

            socket.on('disconnect', () => {
                logoutUser(socket);
            });

            socket.on('getAllUsers', async (callback) => {
                await getAllUsers(socket, callback);
            });

            socket.on("sendMessage", async (data, callback) => {
                await sendMessages(data.message, socket, data.to, callback);
            })

        });
    },

}