import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { ListPage } from './list';

@NgModule({
  declarations: [ListPage],
  imports: [
    IonicPageModule.forChild(ListPage),
    Ng2SearchPipeModule,
  ],
})
export class ListPageModule { }