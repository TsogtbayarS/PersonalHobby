import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistDataService } from '../artist-data.service';
import { Artist } from '../artist.service';
import { UserDataService } from '../user-data.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {
  artist: Artist;
  constructor(private route: ActivatedRoute, private artistService: ArtistDataService, private _router: Router, private userService: UserDataService) {
    this.artist = new Artist("", "", "", [])
  }
  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn;
  }
  ngOnInit(): void {
    const artistId = this.route.snapshot.params[environment.urlArtistId];
    this.artistService.getArtist(artistId).subscribe(artist => {
      this.artist = artist;
    })
  }
  deleteArtist() {
    this.artistService.deleteArtist(this.artist._id).subscribe({
      next: () => {

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this._router.navigate([environment.artistsUrl]);
      }

    })
  }
  goBack() {
    this._router.navigate([environment.artistsUrl]);
  }
}
