import { Component, OnInit } from '@angular/core';
import { PaintingDataService } from '../painting-data.service';
import { Painting } from '../painting.service';

@Component({
  selector: 'app-paintings',
  templateUrl: './paintings.component.html',
  styleUrls: ['./paintings.component.css']
})
export class PaintingsComponent implements OnInit {
  paintings: Painting[] = [];
  constructor(private paintingService: PaintingDataService) { }
  ngOnInit(): void {
    this.paintingService.getPaintings().subscribe(paintings => {
      this.paintings = paintings;
    })
  }

}
