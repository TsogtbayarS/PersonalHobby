import { Component, OnInit } from '@angular/core';
import { ArtistDataService } from '../artist-data.service';
import { Artist } from '../artist.service';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})

export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];
  constructor(private artistService: ArtistDataService, private userService: UserDataService) { }
  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn;
  }
  ngOnInit(): void {
    this.artistService.getArtists().subscribe(artists => {
      this.artists = artists;
    })
  }
}
export { Artist };

