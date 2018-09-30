const {User} = require('../models/user');
const logger = require('../lib/logger');
const moment = require('moment')();
const Pending_messages = require('../models/pending_messages');
var UserDto = require('../dto/userDto');
var { setActiveUser,
    getAllActiveUsers,
    deleteActiveSocket,
    deleteActiveUser,
    getAllActiveSockets,
    setActiveSocket }  = require('./activeData');

async function getInActiveUsers () {
    let activeUsers = getAllActiveUsers();
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

module.exports = {

    getInActiveUsers: getInActiveUsers,

    sendAllUsers: async()=>{
        let activeUsers = getAllActiveUsers();
                var inActiveUsers = await getInActiveUsers();

                inActiveUsers = inActiveUsers.map(user => {
                    user["socketId"] = null;
                    let obj = new UserDto(user)
                    obj["active"] = false
                    return obj;
                });
                activeUsers = activeUsers.map(user => {
                    user["active"]=true;
                    return user;
                });
                let users = activeUsers.concat(inActiveUsers);
                return users;
    },

    getAllUsers: async (socket, callback) => {
        let activeUsers = getAllActiveUsers();
        if (socket.loggedIn) {
            console.log("inside get All Users",activeUsers);
                var inActiveUsers = await getInActiveUsers();

                inActiveUsers = inActiveUsers.map(user => {
                    user["socketId"] = socket.id;
                    let obj = new UserDto(user)
                    obj["active"] = false
                    return obj;
                });
                activeUsers = activeUsers.map(user => {
                    user["active"]=true;
                    return user;
                });
                let users = activeUsers.concat(inActiveUsers);
                callback({ users });
                return;
        }
        callback({ users: null });
        return;
    },
    sendMessages: async (message, socket, to, callback) => {
        let activeUsers = getAllActiveUsers();
        let activeSockets = getAllActiveSockets();
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
            console.log(toUser);

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
    },

    joinRoom: async (room, member, socket, callback)=>{
        socket.join(room);
    },
}

