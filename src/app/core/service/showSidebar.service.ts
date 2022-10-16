import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class SideBarService {
  private showLogin = new BehaviorSubject<boolean>(false);
  showLogin$ = this.showLogin.asObservable();
    constructor() { }
  showSideBar(){
    this.showLogin.next(true);
  }

  hiddenSideBar(){
    this.showLogin.next(false);
  }

}
