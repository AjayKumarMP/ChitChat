import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Socket } from 'ng-socket-io';

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
  public message:any = '';
  public messages :Array<{me:boolean,data:any, from: any}> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private socket: Socket) {
    this.user = this.navParams.get('selectedUser');
    if(!this.user){
      // this.navCtrl.setRoot(HomePage);
      this.navCtrl.popToRoot();
      return;
    }
    console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatpagePage');
  }

  async ngOnInit(){
    
    // code which will look for the new incoming messages from the server. 
    this.socket.on('newMessage', (data)=>{
        this.messages.push({me: false, data: data.message, from: data.from});
    });
  }

  

  public sendMessage(message){
    this.message = ''
    this.messages.push({me:true, data: message, from: null});
    console.log(message, this.message);
  }

}
