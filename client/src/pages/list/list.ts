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
  public messageRepository: any;
  private messageSubscription: any;
  private currentChatUser: any;

  constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams,
    private socket: Socket, private appService: AppService) {
    this.messageSubscription = this.appService.getMessage()
      .subscribe((data: any) => {
        if (!this.currentChatUser) {
          let user = this.users.find(user => {
            return user.id === data.from;
          });
          if (this.users[this.users.indexOf(user)] && this.users[this.users.indexOf(user)]["msgsCount"]) {
            this.users[this.users.indexOf(user)]["msgsCount"] += 1;
          } else {
            this.users[this.users.indexOf(user)]["msgsCount"] = 1;
          }
        }
      });
  }

  async ionViewDidLoad() {

    this.socket.emit('getAllUsers', async (data) => {
      this.storage.set('allUsers', data.users);

      this.messageRepository = this.appService.getAllMsgsFromRepo();

      const userData = await this.storage.get('currentUser');
      if (data.users) {
        this.users = data.users.filter(user => {
          let len;
          if (this.messageRepository[user.id]) {
            len = this.messageRepository[user.id].filter(msg => {
              return msg.viewed == false;
            });
          }
          user["msgsCount"] = len ? len.length : len;
          return user.email !== userData.email;
        });
      }
    });
    const userData = await this.storage.get('currentUser');
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


  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.currentChatUser = undefined;
  }

  public openChat(selectedUser) {
    this.users[this.users.indexOf(selectedUser)]["msgsCount"] = undefined;
    this.appService.setMsgsAsViewed(selectedUser.id);
    this.currentChatUser = selectedUser;
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
