import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public inActiveUsers: any = [];
  public activeUsers : any = [];

  constructor(public navCtrl: NavController, private socket: Socket) {

  }

  ngOnInit(){
    this.socket.emit('getAllUsers', (users)=>{
      console.log(users);
      this.activeUsers = users.activeUsers !== null? users.activeUsers: [];
      this.inActiveUsers - users.inActiveUsers !== null? users.inActiveUsers: [];
    });
  }

}
