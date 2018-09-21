import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any ;

  pages: Array<{ title: string, component: any }>;

  constructor(private storage: Storage, private socket: Socket, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    this.socket.connect();
    // this.storage.set('jwt-token',"dssds");
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  async ngOnInit() {
    let token = await this.storage.get('jwt-token');
    
      if(token) {
        this.socket.emit('verify-auth', { token }, (data)=> {
          if(data.success && data.auth){
            this.rootPage = HomePage;
          }else {
            this.rootPage = LoginPage;
          }
        });
      }else{
        this.rootPage = LoginPage;
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
