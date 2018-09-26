const jwt = require('jsonwebtoken');

var User = require('../models/user');
var Pending_messages = require('../models/pending_messages');
const logger = require('../lib/logger');
const config = require('../../config/env');
var { sendAllUsers } = require('./chatService');
var { setActiveUser,
    getAllActiveUsers,
    deleteActiveSocket,
    deleteActiveUser,
    getAllActiveSockets,
    setActiveSocket }  = require('./activeData');

module.exports = {
    /**
     * 
     */
    loginUser: async (user, socket, callback, getIO) => {
        try {
            let activeUsers = getAllActiveUsers();
            var existUser = await User.find({
                where: {
                    email: user.email
                },
                include: [{
                    model: Pending_messages,
                    as: 'pending_messages'
                }]
            });

            // var user = { id: 1, name: "user", email: "user@gmail.com", password: "password" };
            // var user = await User.findOne({ where: { email: req.body.email } });
            if (!existUser) {
                callback({ success: false, message: "No User Found, Please check the credentials" });
            }
            if (user.password !== existUser.password) {
                callback({ success: false, message: "UnAuthorised Access" });
            }
            var token = jwt.sign({ user: existUser }, config.secret);
            // {
            //     expiresIn: 60000
            // }
            socket.loggedIn = true;
            socket.userId = existUser.id;
            socket.token = token;
            let userLoggedIn = activeUsers.find(user => user.email === existUser.email);

            if (!userLoggedIn) {
                setActiveSocket(socket)
                existUser["socketId"] = socket.id;
                existUser["active"] = true;
                setActiveUser(existUser)
            }
            let allUsersToSend = await sendAllUsers();
            getIO.sockets.emit('AllUsers', { users: allUsersToSend });
            logger.info('New user has been Logged in', existUser.name, existUser.email);
            callback({ success: true, auth: true, message: "accees granted", user: existUser, token });
        } catch (error) {
            console.log("Error in logging in the USer", error);
            callback({ success: false, message: "Error in logging in the USer" + error.message });
        }

    },

    /**
     * 
     */

    registreUser: async (user, callback, socketId, getIO) => {
        var newUser = '';
        try {
            let userExists = await User.find({
                where: {
                    email: user.email
                }
            });

            if (!userExists) {
                newUser = await User.create({
                    name: user.name,
                    email: user.email,
                    password: user.password
                });
            } else {
                callback({ success: false, message: "user Already exists, Please Login or reset Password" });
                return;
            }
        } catch (error) {
            logger.error('Error in regestering User ', user, error);
            callback({ success: false, message: error.message });
            return;
        }
        let allUsersToSend = await sendAllUsers();
        getIO.sockets.emit('AllUsers', { users: allUsersToSend });
        callback({ success: true, message: "user registered successfully", user: newUser });
        return;
    },

    logoutUser: async (socket, getIO) => {
        try {
            let activeUsers = getAllActiveUsers();
            var existUser = activeUsers.filter(user => user.id === socket.userId);
            // var existUser = await User.find({ where: { socketId: socket.id } });
            // await User.update({ active: false }, { where: { socketId: socket.id } })
            console.log("inside logout user");
            if (existUser.length > 0) {
                socket.loggedIn = false;
                socket.userId = null;
                activeUsers = deleteActiveUser(existUser[0]);
                logger.info('A user has been Logged out', existUser[0].name, existUser[0].email);
            } else {
                logger.error('Error in fetching user', existUser);
            }
            let allUsersToSend = await sendAllUsers();
            getIO.sockets.emit('AllUsers', { users: allUsersToSend });
        } catch (error) {
            logger.error('Error in fetching user', error);
        }
    },

    verifyAuth: async (token, socket, callback, getIO) => {
        let activeUsers = getAllActiveUsers();
        let activeSockets = getAllActiveSockets();
        if (!token) {
            socket.loggedIn = false;
            callback({ auth: false, message: 'No token provided.' });
        }
        try {
            var decoded = await jwt.verify(token, config.secret);
            var decodedUser = await User.findById(decoded.user.id);
            // var user = { id: 10, name: "user", email: "user@gmail.com", password: "password" };
            // var user = await User.findById(decoded.user.id);
            if (!decoded.user) {
                callback({ auth: false, message: 'Invalid token' });
            }
            if (decodedUser.password !== decoded.user.password) {
                callback({ success: false, message: "UnAuthorised Access" });
            }

            let userLoggedIn = activeUsers.find(user => user.email === decoded.user.email);

            if (userLoggedIn) {
                let oldSocetToRemove = activeSockets.find(socket => socket.id === userLoggedIn.socketId);
                activeSockets = deleteActiveSocket(oldSocetToRemove);
                activeUsers = deleteActiveUser(userLoggedIn);
            }

            // if (!userLoggedIn) {
            decoded.user["socketId"] = socket.id;
            decoded.user["active"] = true;
            setActiveUser(decoded.user);
            setActiveSocket(socket)
            // }
            socket.loggedIn = true;
            socket.userId = decodedUser.id;
            let allUsersToSend = await sendAllUsers();
            getIO.sockets.emit('AllUsers', { users: allUsersToSend });
            callback({ success: true, auth: true, message: 'authentication sucsessfull', user: decoded.user });
        } catch (error) {
            console.log("Error in logging in the USer", error);
            callback({ success: false, auth: false, message: 'Error in verifying AUTH the USer, Reason:' + error.message });
        }
    },

}