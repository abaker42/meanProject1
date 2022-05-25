/*When creating a new component you normally create a filename.ts, filename.html, and filename.css.
The css file is optional. In the .ts file you must export your class and import component from
angular/core so this new component can be recognized by the app. Each component needs a selector
(html tag name) and templateURL (file path to corresponding html file)*/

import {Component, OnInit, OnDestroy} from "@angular/core";
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
selector: 'app-header',
templateUrl: './header.component.html',
styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

 userAuthenticated = false;
 private authListenerSubs: Subscription;

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.userAuthenticated = this.authService.getUserAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(goodAuth => {
        this.userAuthenticated = goodAuth;
      });
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
}
