import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';
import { IonicPage } from 'ionic-angular';
import { AppService } from '../../app/app.service';

// import { HomePage }  from '../home/home';
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

 @IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public isLogin: boolean = true;
	public user: UserEntity = new UserEntity;
  constructor(private socket: Socket, private storage: Storage, public navCtrl: NavController, public navParams: NavParams,
    private appService: AppService) {
  }

  ionViewDidLoad() {
    
  }

  public login(){
  	if((this.user.email !== null && this.user.email !== '' && this.user.email !== '') &&
  		(this.user.password !== null && this.user.password !== '' && this.user.password !== '')){
        this.socket.emit('login',{email: this.user.email, password: this.user.password}, async(data)=>{
          if(data.success && data.auth){
            await this.storage.remove('currentUser');
            this.storage.set('currentUser',this.user);
            if(this.user.remember){
            await this.storage.remove('jwt-token');
              this.storage.set('jwt-token',data.token);
            }
            if(data.user.pending_messages.length > 0){
              data.user.pending_messages.forEach(msg =>{
              let msgFormat = { data: msg.message, to: null, sentAt:msg.createdAt, from: msg.from, styleClass: 'chat-message left' };
              this.appService.addToMessagesRepository({message: msgFormat,viewed: false},
              {from: msg.from} );
              });
            }
            this.navCtrl.setRoot('ListPage');
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

  public forgotPassword(){

  }

}
