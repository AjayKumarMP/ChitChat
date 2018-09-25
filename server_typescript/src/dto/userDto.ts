export default class UserDto {

        private name:any;
        private email:any;
        private password:any;
        private createdAt:any;
        private deletedAt:any;
        private updatedAt:any;
        private socketId:any;
        private id:any;
        private active:any;

    constructor(user:any){
        this.name = user.name
        this.email = user.email
        this.password = user.password
        this.createdAt = user.createdAt
        this.deletedAt = user.deletedAt
        this.updatedAt = user.updatedAt
        this.socketId = user.socketId
        this.id = user.id;
        this.active = user.active;
    }
}