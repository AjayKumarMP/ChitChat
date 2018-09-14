var User = require('../models/user');
const logger = require('../lib/logger');
module.exports = {
    /**
     * 
     */
    loginUser: async (user, callback) => {
        try {
            var existUser = await User.find({ where: { email: user.email } });
            await User.update({ active: true }, { where: { email: user.email } });
            if (existUser) {
                logger.info('New user has been Logged in', existUser.name, existUser.email);
                callback(existUser);
            } else {
                logger.error('New user trying to login with invalid credentials', user);
                callback(new Error('No User Found, Invalid credentials'));
            }
        } catch (error) {
            logger.error('Error in Logginng in user ', user, error);
            callback(new Error('Error in loggin in the user'));
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
                socketId,
                active: false
            });
        } catch (error) {
            logger.error('Error in regestering User ', user, error);
            callback(new Error('Error in server, Please try again'));
        }
        callback(newUser);
    },

    logoutUser: async (socket) => {
        var newUser = '';
        try {
            var existUser = await User.find({ where: { socketId: socket.id } });
            await User.update({ active: false }, { where: { socketId: socket.id } })
            if (existUser) {
                logger.info('A user has been Logged out', existUser.name, existUser.email);
            } else {
                logger.error('Error in fetching user', existUser);
            }
        } catch (error) {
            logger.error('Error in fetching user', error);
        }
    },

}