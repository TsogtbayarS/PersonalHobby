import { Component, OnInit } from '@angular/core';
import { ArtistDataService } from '../artist-data.service';
import { Artist } from '../artist.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})

export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];
  constructor(private artistService: ArtistDataService) { }
  ngOnInit(): void {
    this.artistService.getArtists().subscribe(artists => {
      this.artists = artists;
    })
  }
}
export { Artist };

