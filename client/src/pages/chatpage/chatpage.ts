import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import * as $ from "jquery";
import { AppService } from '../../app/app.service';

// import { HomePage } from '../home/home';
/**
 * Generated class for the ChatpagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatpage',
  templateUrl: 'chatpage.html',
})
export class Chatpage {

  public user:any;
  private subscription: any;
  public message:any = '';
  public messages :Array<{to:any, data:any, from: any, styleClass:any}> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private socket: Socket, 
              private appService: AppService) {
    let currentUser = this.navParams.get('selectedUser');
    if(!currentUser){
      // this.navCtrl.setRoot(HomePage);
      this.navCtrl.setRoot('HomePage');
      return;
    }else {
      this.appService.setCurrentChatUser(currentUser);
      this.appService.chatTabOpened = true;
      this.user = currentUser;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatpagePage');
  }

  ngOnInit(){ 
    this.messages = JSON.parse(JSON.stringify(this.appService.getAllMessagesOfUser(this.user.id)));
    this.subscription = this.appService.getMessage()
    .subscribe((data: any)=>{
      this.messages.push(data.message);
    },err=>{
      console.log("error in getting message from server, In ChatPage.ts:56",err);
    });
   }

  ngOnDestroy(){
    this.appService.setCurrentUser(undefined);
    this.appService.chatTabOpened = false;
    // unsubscribe to ensure no memory leaks
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
  

  public sendMessage(message){
    this.socket.emit('sendMessage',{message, to: this.user.email},(data)=>{
      console.log(data);
    });
    this.message = ''
    let msg = {to: this.user.email, data: message, from: null, styleClass:'chat-message right'};
    this.appService.addToMessagesRepository({message:msg, viewed: true});
     this.messages.push(msg);
    // this.scrollToBottom();
  }

  public scrollToBottom(){
    let messages = $('#messages');
    let new_message = messages.children('div#msg:last-child');

    let clientHeight = messages.prop('clientHeight')
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = new_message.innerHeight();
    let lastMessageHeight = new_message.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
      console.log("should scroll");
      messages.scrollTop(scrollHeight);
      messages.animate({ scrollTop: scrollHeight}, 1000);
    }
  }

}
