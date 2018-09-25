import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicPage } from 'ionic-angular';
import { Socket } from 'ng-socket-io';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  users:any =[];

  constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams, private socket: Socket) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  async ngOnInit(){
    this.socket.on('AllUsers', (data)=>{
      this.users = data.users;
      this.storage.set('allUsers',data.users);
    });
    let localData = await this.storage.get('allUsers');
    this.users = localData.users;
    console.log(this.users);
  }

  public openChat(selectedUser){
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
