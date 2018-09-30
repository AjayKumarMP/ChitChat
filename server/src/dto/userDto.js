class UserDto {
    constructor(user){
        this.name = user.name
        this.email = user.email
        this.password = user.password
        this.createdAt = user.createdAt
        this.deletedAt = user.deletedAt
        this.updatedAt = user.updatedAt
        this.socketId = user.socketId
        this.id = user.id;
        this.active = user.active;
        this.last_seen = user.last_seen;
    }
}

module.exports = UserDto;