var UserDto = require('../dto/userDto');

var activeUsers = [];
var activeSockets = [];

function getAllActiveUsers() {
    return activeUsers;
}

function setActiveUser(user) {
    activeUsers.push(new UserDto(user));
}

function getAllActiveSockets() {
    return activeSockets;
}

function setActiveSocket(socket) {
    activeSockets.push(socket);
}

function deleteActiveSocket(socket) {
    activeSockets.splice(activeSockets.indexOf(socket), 1);
    return activeSockets;
}

function deleteActiveUser(user) {
    const userToBeDeleted = activeUsers.find(usr => {
        return usr.id === user.id;
    });
    activeUsers.splice(activeUsers.indexOf(userToBeDeleted), 1);
    return activeUsers;
}

module.exports = {
    setActiveUser,
    getAllActiveUsers,
    deleteActiveSocket,
    deleteActiveUser,
    getAllActiveSockets,
    setActiveSocket
}