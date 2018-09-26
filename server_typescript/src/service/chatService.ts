import ActiveData from './activeData';
import User from '../models/user';
import logger from '../lib/logger';
// import {moment} from 'moment';
import Pending_messages from '../models/pending_messages';
import UserDto from '../dto/userDto';

export default class ChatService{
    private activeData: ActiveData;
    // private moment: Moment ;
    constructor(){
        this.activeData = new ActiveData();
    }

    public async getInActiveUsers () {
        let activeUsers = this.activeData.activeUsers;
        let userIds = activeUsers.map((user:any) => user.id);
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

    public async sendAllUsers(){
        let activeUsers = this.activeData.activeUsers;
                var inActiveUsers = await this.getInActiveUsers();

                inActiveUsers = inActiveUsers.map((user: any) => {
                    user["socketId"] = null;
                    let obj = new UserDto(user);
                    obj["active"] = false;
                    return obj;
                });
                activeUsers = activeUsers.map((user: any) => {
                    user["active"]=true;
                    return user;
                });
                let users = activeUsers.concat(inActiveUsers);
                return users;
    }

    public async getAllUsers(socket: any, callback: any){
        let activeUsers = this.activeData.activeUsers;
        if (socket.loggedIn) {
            console.log("inside get All Users",activeUsers);
                var inActiveUsers = await this.getInActiveUsers();

                inActiveUsers = inActiveUsers.map((user: any) => {
                    user["socketId"] = null;
                    let obj = new UserDto(user)
                    obj["active"] = false
                    return obj;
                });
                activeUsers = activeUsers.map((user:any) => {
                    user["active"]=true;
                    return user;
                });
                let users = activeUsers.concat(inActiveUsers);
                callback({ users });
                return;
        }
        callback({ users: null });
        return;
    }

    public async sendMessages(message:any, socket: any, to: any, callback: any){
        let activeUsers = this.activeData.activeUsers;
        let activeSockets = this.activeData.activeSockets;
        let toUser = activeUsers.find((user: any) => user.email === to);
        if (toUser) {
            let userSocket = activeSockets.find((socket: any) => socket.id === toUser.socketId);
            if (userSocket) {
                userSocket.emit("newMessage", { from: socket.userId, message, sentAt: new Date() });
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
    }

    public async joinRoom(room: any, member: any, socket: any, callback: any){
        socket.join(room)
    }
}