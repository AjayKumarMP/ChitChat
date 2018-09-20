const { activeUsers, activeSockets } = require('./authService');
const User = require('../models/user');
const logger = require('../lib/logger');
const moment = require('moment')();
const Pending_messages = require('../models/pending_messages');

module.exports = {

    getInActiveUsers,

    getAllUsers: async (socket, callback) => {
        if (socket.loggedIn) {
            var InActiveUsers = await getInActiveUsers();
            if (InActiveUsers) {
                callback({ activeUsers, InActiveUsers });
                return;
            }
        }
        callback({ activeUsers: null, InActiveUsers: null });
        return;
    },
    sendMessages: async (message, socket, to, callback) => {
        let toUser = activeUsers.find(user => user.email === to);
        if (toUser) {
            let userSocket = activeSockets.find(socket => socket.id === toUser.socketId);
            if (userSocket) {
                userSocket.emit("newMessage", { from: socket.userId, message, sentAt: moment.valueOf() });
                callback({ success: true, delivered: true });
                return;
            }
        }


        try {
            toUser = await User.find({
                where: {
                    email: to
                }
            });

            await Pending_messages.create({
                message,
                from: socket.userId,
                USERId: toUser.id
            });

        } catch (error) {
            console.log(error);
            callback("error");
        }

        callback({ success: true, delivered: false, toUser });
    }
}

var getInActiveUsers = async () => {
    let userIds = activeUsers.map(user => user.id);
    try {
        var inActiveUsers = await User.findAll({
            where: {
                id: {
                    $notIn: userIds
                }
            }
        });
        return inActiveUsers;
    } catch (error) {
        logger.info('error in getting inActive users in chatService: getInActiveUsers()', error.message);
        return false;
    }
}