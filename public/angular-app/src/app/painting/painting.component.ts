import { Component, OnInit } from '@angular/core';
import { PaintingDataService } from '../painting-data.service';
import { ActivatedRoute } from '@angular/router';
import { Painting } from '../painting.service';
import { ArtistDataService } from '../artist-data.service';

@Component({
  selector: 'app-painting',
  templateUrl: './painting.component.html',
  styleUrls: ['./painting.component.css']
})

export class PaintingComponent implements OnInit {
  painting: Painting;
  constructor(private route: ActivatedRoute, private paintingService: ArtistDataService) {
    this.painting = new Painting("", "", 0);
  }
  ngOnInit(): void {
    const paintingId = this.route.snapshot.params["paintingId"];
    const artistId = this.route.snapshot.params["artistId"];
    this.paintingService.getPainting(artistId,paintingId).subscribe(painting => {
      this.painting = painting;
    })
  }

}
