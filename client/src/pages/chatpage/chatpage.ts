import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import * as $ from "jquery";

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

  public user:{name:'',active:boolean,email: string} = {name:'',active:false, email:''};
  public message:any = '';
  public messages :Array<{data:any, from: any, styleClass:any}> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private socket: Socket) {
    let currentUser = this.navParams.get('selectedUser');
    if(!currentUser){
      // this.navCtrl.setRoot(HomePage);
      this.navCtrl.setRoot('HomePage');
      return;
    }else {
      this.user = currentUser;
    }
    console.log(this.user);

    // code which will look for the new incoming messages from the server. 
    this.socket.on('newMessage', (data)=>{
      console.log(data);
        this.messages.push({data: data.message, from: data.from, styleClass:'chat-message left'});
    });

    // setInterval(()=>{
    //   this.messages.push({data: "dihsdhisdi", from: 'ajay', styleClass:'chat-message left'});
    //   this.scrollToBottom();
    // },7000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatpagePage');
  }

  async ngOnInit(){
  }

  

  public sendMessage(message){
    this.socket.emit('sendMessage',{message, to: this.user.email},(data)=>{
      console.log(data);
    });
    this.message = ''
    this.messages.push({data: message, from: null, styleClass:'chat-message right'});
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
