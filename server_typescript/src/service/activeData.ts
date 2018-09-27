import UserDto from "../dto/userDto";

export default class ActiveData {
    private _activeUsers: any;
    private _activeSockets: any;
    constructor(){}

    get activeUsers() {
        return this._activeUsers;
    }

    set activeUsers(user: any) {
        const newUser = new UserDto(user);
        this._activeUsers.push(newUser);
    }

    public removeActiveUser(user: any) {
        this._activeUsers.splice(user, 1);
    }

    public removeActiveSocket(socket: any) {
        this._activeUsers.splice(socket, 1);
    }

    get activeSockets() {
        return this._activeSockets;
    }

    set activeSockets(socket: any) {
        this._activeSockets.push(socket);
    }
}
