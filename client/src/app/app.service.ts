import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AppService {

  private currentUser: any = {};
  private incomingMessages = new Subject<any>();
  private messageRepository: any = {}
  public chatTabOpened: boolean = false;
  private currentChatUser: any = {};

  constructor(private socket: Socket) {
    // code which will look for the new incoming messages from the server. 
    this.socket.on('newMessage', (data) => {
      let msg = { data: data.message, to: null, sentAt:data.sentAt, from: data.from, styleClass: 'chat-message left' };
      if (!this.messageRepository[data.from]) {
        this.messageRepository[data.from] = [];
      }

      this.sendMessage(msg, data.from);
      this.messageRepository[data.from].push({ message: msg, viewed: true});
      // if (this.chatTabOpened && this.currentChatUser && this.currentChatUser.id === data.from) {
      //   this.sendMessage(msg, data.from);
      //   this.messageRepository[data.from].push({ message: msg, viewed: true });
      // } else {
      //   this.messageRepository[data.from].push({ message: msg, viewed: false });
      // }
    });
  }

  public addToMessagesRepository(message: any, user: any) {
    if (!this.messageRepository[user.from]) {
      this.messageRepository[user.from] = [];
    }
    this.messageRepository[user.from].push(message);
  }
  sendMessage(message: any, from: any) {
    this.incomingMessages.next({message, from});
  }

  clearMessage() {
    this.incomingMessages.next();
  }

  getMessage(): Observable<any> {
    return this.incomingMessages.asObservable();
  }

  getAllMessagesOfUser(userId: number) {
    if (this.messageRepository && this.messageRepository[userId]) {
      const msgs = this.messageRepository[userId] && this.messageRepository[userId].map(msg => {
        return msg.message;
      });
      return msgs;
    }
    // .filter(message =>{
    //     return message.from === userId;
    // });
    return [];
  }

  public getAllMsgsFromRepo() {
    return this.messageRepository;
  }

  public getCurrentChatUser() {
    return this.currentChatUser;
  }

  public setCurrentChatUser(user: any) {
    this.currentChatUser = user;
  }

  public setCurrentUser(user: any) {
    this.currentUser = user;
  }

  public getCurrentUser() {
    return this.currentUser;
  }

  public setMsgsAsViewed(userId) {
    this.messageRepository[userId] = this.messageRepository[userId] && this.messageRepository[userId].map(msg => {
      msg.viewed = true;
      return msg;
    });
  }
}
