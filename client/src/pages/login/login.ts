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

 class UserEntity{
  public name:string;
  public email: string;
  public password: any;
  public reEnterPassword:any;
  public remember: boolean;

   constructor(){
     this.name = '';
     this.email = '';
     this.password = '';
     this.reEnterPassword = '';
     this.remember = false;
   }
 }

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public isLogin: boolean = true;
	private user: UserEntity = new UserEntity;
  constructor(private socket: Socket, private storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
  }

  public login(){
  	if((this.user.email !== null && this.user.email !== '' && this.user.email !== '') &&
  		(this.user.password !== null && this.user.password !== '' && this.user.password !== '')){
        this.socket.emit('login',{email: this.user.email, password: this.user.password},(data)=>{
          if(data.success && data.auth){
            if(this.user.remember){
              this.storage.set('jwt-token',data.token);
            }
            this.navCtrl.setRoot(HomePage);
          }
        });
  			
  			// this.navCtrl.push(HomePage);
  		}
  }

  public signup(){
    this.isLogin = false;
  }

  public signUpUser(){
    if(this.user.email && this.user.name && this.user.password && this.user.reEnterPassword
       && this.user.password === this.user.reEnterPassword){
        this.socket.emit('register', {
          name: this.user.name,
          email: this.user.email,
          password: this.user.password }, (data)=>{
            this.user = new UserEntity();
            if(data.success){
              this.isLogin = true;
              console.log(data.message);
            } else{
              this.isLogin = false;
              console.log(data.message);
            }
          });
       }
    
  }

}
