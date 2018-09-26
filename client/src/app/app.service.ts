import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AppService {

  private currentUser:any = {};
  private incomingMessages = new Subject<any>();
  private messageRepository:any = {}
  public chatTabOpened: boolean = false;
  private currentChatUser: any = {};

  constructor(private socket: Socket) { 
    // code which will look for the new incoming messages from the server. 
    this.socket.on('newMessage', (data)=>{
        let msg = {data: data.message, to: null, from: data.from, styleClass:'chat-message left'};
        if(!this.messageRepository[this.currentChatUser.id]){
          this.messageRepository[this.currentChatUser.id] = [];
         }
        this.messageRepository[this.currentChatUser.id].push(msg);
        if(this.chatTabOpened && this.currentChatUser && this.currentChatUser.id === data.from){
          this.sendMessage(msg);
        }
    });
  }

 public addToMessagesRepository(message: any){
   if(!this.messageRepository[this.currentChatUser.id]){
    this.messageRepository[this.currentChatUser.id] = [];
   }
   this.messageRepository[this.currentChatUser.id].push(message);
 }
  sendMessage(message: any) {
    this.incomingMessages.next(message);
  }

  clearMessage() {
      this.incomingMessages.next();
  }

  getMessage(): Observable<any> {
      return this.incomingMessages.asObservable();
  }

  getAllMessagesOfUser(userId: number){
    if(this.messageRepository && this.messageRepository[userId]){
      return this.messageRepository[userId];
    }
    // .filter(message =>{
    //     return message.from === userId;
    // });
    return [];
  }

  public getCurrentChatUser(){
    return this.currentChatUser;
  }

  public setCurrentChatUser(user: any){
    this.currentChatUser = user;
  }

  public setCurrentUser(user:any){
    this.currentUser = user;
  }

  public getCurrentUser(){
    return this.currentUser;
  }
}
