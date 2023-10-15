import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistDataService } from '../artist-data.service';
import { Artist } from '../artist.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {
  artist:Artist;
  constructor(private route:ActivatedRoute, private artistService: ArtistDataService){
    this.artist = new Artist("","","",[])
  }
  ngOnInit(): void {
    const artistId = this.route.snapshot.params["artistId"];
    this.artistService.getArtist(artistId).subscribe(artist => {
      this.artist = artist;
    })
  }

}
