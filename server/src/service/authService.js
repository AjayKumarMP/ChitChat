var User = require('../models/user');
var Pending_messages = require('../models/pending_messages');
const logger = require('../lib/logger');

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

            // await User.update({ active: true }, { where: { email: user.email } });
            if (existUser) {
                socket.loggedIn = true;
                socket.userId = existUser.id;
                let obj = {
                    createdAt: existUser.createdAt,
                    deletedAt: existUser.deletedAt,
                    email: existUser.email,
                    id: existUser.id,
                    name: existUser.name,
                    socketId: socket.id,
                    updatedAt: existUser.updatedAt
                }
                activeUsers.fin
                let userLoggedIn = activeUsers.find(user => user.email === existUser.email);
                if (!userLoggedIn) {
                    activeSockets.push(socket);
                    activeUsers.push(obj);
                }
                logger.info('New user has been Logged in', existUser.name, existUser.email);
                callback(existUser);
                return;
            } else {
                logger.error('New user trying to login with invalid credentials', user);
                callback('New user trying to login with invalid credentials');
            }
        } catch (error) {
            logger.error('Error in Logginng in user ', user, error);
            callback(error.message);
            return;
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
                email: user.email
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
            var existUser = activeUsers.filter(user => user.socketId === socket.id);
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

}