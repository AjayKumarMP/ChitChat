var User = require('../models/user');

module.exports = {
    handleChatOps: (io)=>{
        var users = [];
        io.on('connection',  (socket)=>{

            console.log("User conneced");

            socket.on('login' ,async (user, callback)=>{
                var newUser = await User.find({where: {email:user.email}});
                callback(newUser);
            });

            socket.on('register' ,async (user, callback)=>{
                var newUser = await User.create({
                    name: user.name,
                    email: user.email,
                    socketId: socket.id
                });
                callback(newUser);
            });

        });
    },

}