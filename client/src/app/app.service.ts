import { Injectable } from '@angular/core';

@Injectable()
export class AppService {

  private currentUser:any;

  constructor() { }

  public setCurrentUser(user:any){
    this.currentUser = user;
  }

  public getCurrentUser(){
    return this.currentUser;
  }
}
