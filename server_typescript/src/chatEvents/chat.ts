import AuthService from '../service/authService';
import ChatService from '../service/chatService';
import logger from '../lib/logger';

export default class Chat {

    private authService: AuthService;
    private chatService: ChatService;

    constructor() {
        this.authService = new AuthService();
        this.chatService = new ChatService();
    }

    public checkLoggedInStatus(socket: any, callback: any) {
        if (socket.loggedIn && socket.userId) {
            return;
        }
        callback({ auth: false, message: "Authentication Error" });
    }

    public handleChatOps(io: any) {
        io.on('connection', (socket: any) => {
            socket.loggedIn = false;
            logger.info("New User conneced");
            console.log("New User conneced");

            socket.on("verify-auth", async (data: any, callback: any) => {
                await this.authService.verifyAuth(data.token, socket, callback);
            });

            socket.on('login', async (user: any, callback: any) => {
                await this.authService.loginUser(user, socket, callback);
            });

            socket.on('logout', async () => {
                this.authService.logoutUser(socket);
            });

            socket.on('register', async (user: any, callback: any) => {
                await this.authService.registreUser(user, callback, socket.id);
            });

            socket.on('disconnect', () => {
                console.log("user Got disconnected", socket.userId)
                // logoutUser(socket);
            });

            socket.on('getAllUsers', async (callback: any) => {
                this.checkLoggedInStatus(socket, callback);
                await this.chatService.getAllUsers(socket, callback);
            });

            socket.on("sendMessage", async (data: any, callback: any) => {
                this.checkLoggedInStatus(socket, callback);
                console.log("inside send message", data);
                await this.chatService.sendMessages(data.message, socket, data.to, callback);
            });

            socket.on("joinRoom", async (data: any, callback: any) => {
                this.checkLoggedInStatus(socket, callback);
                this.chatService.joinRoom(data.room, data.member, socket, callback);
            });
        });
    }
}