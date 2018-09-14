var User = require('../models/user');
var { loginUser, registreUser, logoutUser } = require('../service/authService');
var logger = require('../lib/logger');

module.exports = {
    handleChatOps: (io) => {
        var users = [];
        io.on('connection', (socket) => {

            logger.info("New User conneced");
            console.log("New User conneced");
            
            socket.on('login', (user, callback)=>{
                loginUser(user, callback);
            });
            
            socket.on('register', (user, callback)=>{
                registreUser(user, callback, socket.id);
            });

            socket.on('disconnect', () => {
                logoutUser(socket);
            });

        });
    },

}