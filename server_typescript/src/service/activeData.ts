import UserDto from '../dto/userDto';

export default class ActiveData {
    private _activeUsers:any;
    private _activeSockets:any;
    constructor(){}

    get activeUsers(){
        return this._activeUsers;
    }

    public removeActiveUser(user: any){
        this._activeUsers.splice(user, 1);
    }

    public removeActiveSocket(socket: any){
        this._activeUsers.splice(socket, 1);
    }

    set activeUsers(user:any){
        let newUser = new UserDto(user);
        this._activeUsers.push(newUser);
    }

    get activeSockets(){
        return this._activeSockets;
    }

    set activeSockets(socket:any){
        this._activeSockets.push(socket);
    }
}