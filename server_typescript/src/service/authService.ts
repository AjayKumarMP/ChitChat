
import jwt from 'jsonwebtoken';

import User from '../models/user';
import Pending_messages from '../models/pending_messages';
import logger from '../lib/logger';
import config from '../config/env';
import ChatService from './chatService';
import ActiveData from './activeData';
import io from '../index';

export default class AuthService{
    private activeData:ActiveData;
    private chatService: ChatService;
    
    constructor(){
        this.chatService = new ChatService();
        this.activeData = new ActiveData();
    }

    public  async loginUser(user:any, socket:any, callback:any) {
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
            let activeUsers:any = this.activeData.activeUsers;
            let userLoggedIn = activeUsers.find((user:any) => user.email === existUser.email);

            if (!userLoggedIn) {
                this.activeData.activeSockets =socket; 
                existUser["socketId"] = socket.id;
                existUser["active"] = true;
                this.activeData.activeUsers = existUser;
            }
            let allUsersToSend = await this.chatService.sendAllUsers();
            io.emit('AllUsers', { users: allUsersToSend });
            logger.info('New user has been Logged in', existUser.name, existUser.email);
            callback({ success: true, auth: true, message: "accees granted", user: existUser, token });
        } catch (error) {
            console.log("Error in logging in the USer", error);
            callback({ success: false, message: "Error in logging in the USer" + error.message });
        }

    }

    public async registreUser(user: any, callback: any, socketId: any){
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
        let allUsersToSend = await this.chatService.sendAllUsers();
        io.emit('AllUsers', { users: allUsersToSend });
        callback({ success: true, message: "user registered successfully", user: newUser });
        return;
    }

    public async logoutUser(socket: any){
        try {
            let activeUsers = this.activeData.activeUsers;
            var existUser = activeUsers.filter((user: any) => user.id === socket.userId);
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
            let allUsersToSend = await this.chatService.sendAllUsers();
            io.emit('AllUsers', {users:allUsersToSend});
        } catch (error) {
            logger.error('Error in fetching user', error);
        }
    }

    public async verifyAuth(token: any, socket: any, callback: any){
        if (!token) {
            socket.loggedIn = false;
            callback({ auth: false, message: 'No token provided.' });
        }
        try {
            var decoded:any = await jwt.verify(token, config.secret);
            var decodedUser = await User.findById(decoded.user.id);
            let activeUsers = this.activeData.activeUsers;
            let activeSockets = this.activeData.activeSockets;
            // var user = { id: 10, name: "user", email: "user@gmail.com", password: "password" };
            // var user = await User.findById(decoded.user.id);
            if (!decoded.user) {
                callback({ auth: false, message: 'Invalid token' });
            }
            if (decodedUser.password !== decoded.user.password) {
                callback({ success: false, message: "UnAuthorised Access" });
            }

            let userLoggedIn = activeUsers.find((user: any) => user.email === decoded.user.email);

            if (userLoggedIn) {
                let oldSocetToRemove = activeSockets.find((socket: any) => socket.id === userLoggedIn.socketId);
                this.activeData.removeActiveUser(userLoggedIn);
                this.activeData.removeActiveSocket(oldSocetToRemove);
            }

            // if (!userLoggedIn) {
            decoded.user["socketId"] = socket.id;
            decoded.user["active"] = true;
            this.activeData.activeUsers = decoded.user;
            this.activeData.activeSockets = socket;
            // }
            socket.loggedIn = true;
            socket.userId = decodedUser.id;
            let allUsersToSend = await this.chatService.sendAllUsers();
            io.emit('AllUsers', {users:allUsersToSend});
            callback({ success: true, auth: true, message: 'authentication sucsessfull', token });
        } catch (error) {
            console.log("Error in logging in the USer", error);
            callback({ success: false, auth: false, message: 'Error in verifying AUTH the USer, Reason:' + error.message });
        }
    }
}