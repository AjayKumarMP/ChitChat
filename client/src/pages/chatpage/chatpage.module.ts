import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Chatpage } from './chatpage';

@NgModule({
  declarations: [
    Chatpage,
  ],
  imports: [
    IonicPageModule.forChild(Chatpage),
  ],
})
export class ChatpagePageModule {}
