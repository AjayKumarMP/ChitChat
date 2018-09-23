import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
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
  public messages :Array<{me:boolean,data:any}> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatpagePage');
  }

  async ngOnInit(){
    this.user = this.navParams.get('selectedUser');
    if(!this.user){
      await this.navCtrl.popToRoot();
      return;
    }
    console.log(this.user);
  }

  public sendMessage(message){
    this.message = ''
    this.messages.push({me:true, data: message});
    console.log(message, this.message);
  }

}
