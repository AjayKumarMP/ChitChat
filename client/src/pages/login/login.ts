import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';

import { HomePage }  from '../home/home';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	private user:any={email:'',password:''};
  constructor(private socket: Socket, private storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
  }

  public login(){
  	if((this.user.email !== null && this.user.email !== '' && this.user.email !== '') &&
  		(this.user.password !== null && this.user.password !== '' && this.user.password !== '')){
        this.socket.emit('login',{email: this.user.email, password: this.user.password},(data)=>{
          if(data.success && data.auth){
            this.storage.set('jwt-token',data.token);
            this.navCtrl.setRoot(HomePage);
          }
        });
  			
  			// this.navCtrl.push(HomePage);
  		}
  }

}
