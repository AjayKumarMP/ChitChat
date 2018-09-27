import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicPage } from 'ionic-angular';
import { Socket } from 'ng-socket-io';

import { AppService } from '../../app/app.service';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;
  users: any = [];
  public searchTerm: any = {
    name: '',
    email: '',
    password: '',
    createdAt: '',
    deletedAt: "",
    updatedAt: '',
    socketId: '',
    id: null
  };
  public messageRepository:any;

  constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams,
    private socket: Socket, private appService: AppService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];
  }

  async ngOnInit() {
    let userData = await this.storage.get('currentUser');
    if (!userData) {
      this.navCtrl.push('HomePage');
      return;
    }

    this.socket.on('AllUsers', async (data) => {
      let tempData = await this.storage.get('currentUser');
      this.users = data.users.filter(user => {
        return user.email !== tempData.email;
      });
      console.log("users got updated")
      this.storage.set('allUsers', data.users);
    });

    this.messageRepository = this.appService.getAllMsgsFromRepo();
    let localData = await this.storage.get('allUsers');
    if (localData.users) {
      this.users = localData.users.filter(user => {
        let len ;
        if(this.messageRepository[user.id]){
        len = this.messageRepository[user.id].filter(msg =>{
          return msg.viewed == false;
        });
      }
        user["msgsCount"] = len?len.length:len;
        return user.email !== userData.email;
      });
    }
  }

  public openChat(selectedUser) {
    this.appService.setMsgsAsViewed(selectedUser.id);
    this.navCtrl.push('Chatpage', {
      selectedUser
    });
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push('ListPage', {
      item: item
    });
  }
}
