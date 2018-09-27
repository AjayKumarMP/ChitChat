import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public inActiveUsers: any = [];
  public activeUsers : any = [];

  constructor(public navCtrl: NavController, private storage: Storage, private socket: Socket) {

  }

  ngOnInit(){
  }

}
