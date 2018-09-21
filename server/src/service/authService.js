var User = require('../models/user');
var Pending_messages = require('../models/pending_messages');
const logger = require('../lib/logger');
const config = require('../../config/env');
const jwt = require('jsonwebtoken');

var activeUsers = [];
var activeSockets = [];


module.exports = {
    activeUsers,
    activeSockets,
    /**
     * 
     */
    loginUser: async (user, socket, callback) => {
        try {

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
                activeSockets.push(socket);
                activeUsers.push({
                    createdAt: existUser.createdAt,
                    deletedAt: existUser.deletedAt,
                    email: existUser.email,
                    id: existUser.id,
                    name: existUser.name,
                    socketId: socket.id,
                    updatedAt: existUser.updatedAt
                });
            }
            logger.info('New user has been Logged in', existUser.name, existUser.email);
            callback({ success: true, auth: true, message: "accees granted", user: existUser, token });
        } catch (error) {
            console.log("Error in logging in the USer", err.message);
            callback({ success: false, message: "Error in logging in the USer" + err.message });
        }

    },

    /**
     * 
     */

    registreUser: async (user, callback, socketId) => {
        var newUser = '';
        try {
            newUser = await User.create({
                name: user.name,
                email: user.email,
                password: user.password
            });
        } catch (error) {
            logger.error('Error in regestering User ', user, error);
            callback(error.message);
            return;
        }
        callback(newUser);
        return;
    },

    logoutUser: async (socket) => {
        try {
            var existUser = activeUsers.filter(user => user.id === socket.userId);
            // var existUser = await User.find({ where: { socketId: socket.id } });
            // await User.update({ active: false }, { where: { socketId: socket.id } })
            if (existUser.length > 0) {
                socket.loggedIn = false;
                socket.userId = null;
                activeUsers.pop(existUser[0]);
                logger.info('A user has been Logged out', existUser[0].name, existUser[0].email);
            } else {
                logger.error('Error in fetching user', existUser);
            }
        } catch (error) {
            logger.error('Error in fetching user', error);
        }
    },

    verifyAuth: async (token, socket, callback) => {
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
            socket.loggedIn = true;
            socket.userId = decodedUser.id;
            callback({ auth: false, message: 'authentication sucsessfull', token });
        } catch (error) {
            console.log("Error in logging in the USer", error.message);
            callback({ auth: false, message: 'Error in verifying AUTH the USer, Reason:' + error.message });
        }
    },

}