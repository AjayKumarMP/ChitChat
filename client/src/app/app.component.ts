import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';

import { AppService } from './app.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  constructor(private storage: Storage, private socket: Socket, public platform: Platform,
     public statusBar: StatusBar, public splashScreen: SplashScreen, private appService: AppService) {
    this.initializeApp();
    this.socket.connect();

    this.socket.on('disconnect', (reason) => {
      console.log("disconnected from Server");
      // ...	  if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        // this.socket.connect();
      });

    
    // this.storage.set('jwt-token',"dssds");
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage' },
      { title: 'Users', component: 'ListPage' }
    ];

  }

  async ngOnInit() {
    var token = await this.storage.get('jwt-token');
      if (token) {
        this.socket.emit('verify-auth', { token }, (data) => {
          console.log("inside b=verify auth",data);
          if (data.success && data.auth) {
            if(data.user.pending_messages.length > 0){
              data.user.pending_messages.forEach(msg =>{
              let msgFormat = { data: msg.message, to: null, sentAt:msg.createdAt, from: msg.from, styleClass: 'chat-message left' };
              this.appService.addToMessagesRepository({message: msgFormat,viewed: false},
              {from: msg.from} );
              });
            }
            this.appService.setCurrentUser(data.user);
            this.storage.set('currentUser',data.user);
            this.rootPage = 'ListPage';
            this.nav.setRoot('ListPage');
          } else {
            this.rootPage = 'LoginPage';
          }
        });
      } else {
        this.rootPage = 'LoginPage';
      }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
