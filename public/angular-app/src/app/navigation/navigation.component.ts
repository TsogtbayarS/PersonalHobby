import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from '../user-data.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  constructor(private _router: Router, private userService: UserDataService) {
  }

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  onHome(): void {
    this._router.navigate([environment.rootUrl]);
  }
  onArtists(): void {
    this._router.navigate([environment.artists]);
  }

}
