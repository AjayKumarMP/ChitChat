import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  constructor(private storage: Storage, private socket: Socket, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    this.socket.connect();

    this.socket.on('disconnect', (reason) => {
      console.log("disconnected from Server");
      // ...	  if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        // this.socket.connect();
      });

    this.storage.get('jwt-token').then(token => {
      if (token) {
        this.socket.emit('verify-auth', { token }, (data) => {
          // console.log(data);
          if (data.success && data.auth) {
            this.rootPage = 'HomePage';
            this.nav.setRoot('HomePage');
          } else {
            this.rootPage = 'LoginPage';
          }
        });
      } else {
        this.rootPage = 'LoginPage';
      }
    });
    // this.storage.set('jwt-token',"dssds");
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage' },
      { title: 'Users', component: 'ListPage' }
    ];

  }

  ngOnInit() {
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
