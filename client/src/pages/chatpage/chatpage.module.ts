import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Chatpage } from './chatpage';
import { EmojiPickerComponentModule } from '../../components/emoji-picker/emoji-picker.module';
import { EmojiProvider } from "../../providers/emoji";

@NgModule({
  declarations: [
    Chatpage,
  ],
  imports: [
    EmojiPickerComponentModule,
    IonicPageModule.forChild(Chatpage),
  ],
  providers: [
    EmojiProvider
  ]
})
export class ChatpagePageModule {}
