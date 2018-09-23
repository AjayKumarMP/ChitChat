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
    }
}

module.exports = UserDto;