import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Painting } from '../painting.service';
import { ArtistDataService } from '../artist-data.service';
import { Router } from '@angular/router';
import { UserDataService } from '../user-data.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-painting',
  templateUrl: './painting.component.html',
  styleUrls: ['./painting.component.css']
})

export class PaintingComponent implements OnInit {
  artistId!: string;
  painting: Painting;
  constructor(private route: ActivatedRoute, private paintingService: ArtistDataService, private _router: Router, private userService: UserDataService) {
    this.painting = new Painting("", "", 0);
  }
  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn;
  }
  ngOnInit(): void {
    const paintingId = this.route.snapshot.params[environment.urlPaintingId];
    const artistId = this.route.snapshot.params[environment.urlArtistId];
    this.paintingService.getPainting(artistId, paintingId).subscribe(painting => {
      this.artistId = artistId
      this.painting = painting;
    })
  }
  deletePainting(artistId: string, paintingId: string): void {
    this.paintingService.deletePainting(artistId, paintingId).subscribe(
      {
        next: () => {

        },
        error: (error) => {
          console.log(error);

        },
        complete: () => {
          this._router.navigate([environment.artistsUrl + artistId]);
        }
      })
  }
  backToArtist() {
    this._router.navigate([environment.artistsUrl + this.artistId]);
  }

}
