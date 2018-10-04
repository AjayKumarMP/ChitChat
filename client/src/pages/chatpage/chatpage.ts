import { Component, ViewChild, ElementRef } from '@angular/core';
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

  public user: any;
  @ViewChild('chat_input') messageInput: ElementRef;
  public showEmojiPicker: boolean = false;
  private subscription: any;
  public message: any = '';
  public messages: Array<{ to: any, data: any, sentAt: any, from: any, styleClass: any }> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private socket: Socket,
    private appService: AppService) { }

  ionViewDidLoad() {
    if (this.user) {
      this.messages =  JSON.parse(JSON.stringify(this.appService.getAllMessagesOfUser(this.user.id)));
    }
    this.subscription = this.appService.getMessage()
      .subscribe((data: any) => {
        this.messages.push(data.message);
        if(!this.user.active){
          this.user.active = true;
        }
      }, err => {
        console.log("error in getting message from server, In ChatPage.ts:56", err);
      });
  }

  ngOnInit() {
    const currentUser = this.navParams.get('selectedUser');
    if (!currentUser) {
      this.navCtrl.setRoot('ListPage');
      return;
    } else {
      this.appService.setCurrentChatUser(currentUser);
      this.appService.chatTabOpened = true;
      this.user = currentUser;
    }
  }

  ngOnDestroy() {
    this.appService.setCurrentUser(undefined);
    this.appService.chatTabOpened = false;
    // unsubscribe to ensure no memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  public sendMessage(message) {
    if (!message.trim()) return;
    this.socket.emit('sendMessage', { message, to: this.user.email }, (data) => {
      console.log(data);
    });
    this.message = ''
    let msg = { to: this.user.email, sentAt: Date.now(), data: message, from: null, styleClass: 'chat-message right' };
    this.appService.addToMessagesRepository({ message: msg, viewed: true }, { from: this.user.id });
    this.messages.push(msg);
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } 
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  onFocus() {
    this.showEmojiPicker = false;
  }

}
