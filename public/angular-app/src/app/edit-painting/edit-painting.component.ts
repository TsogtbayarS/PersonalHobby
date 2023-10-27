import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistDataService } from '../artist-data.service';
import { Painting } from '../painting.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-edit-painting',
  templateUrl: './edit-painting.component.html',
  styleUrls: ['./edit-painting.component.css']
})
export class EditPaintingComponent implements OnInit {
  paintingForm: FormGroup;
  painting: Painting;

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private artistService: ArtistDataService
  ) {
    this.painting = new Painting("", "", 0);
    this.paintingForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      year: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const artistId = this.route.snapshot.params[environment.urlArtistId];
    const paintingId = this.route.snapshot.params[environment.urlPaintingId];
    this.artistService.getPainting(artistId, paintingId).subscribe(painting => {
      this.painting = painting;
      this.paintingForm.patchValue({
        id: this.painting._id,
        name: this.painting.name,
        year: this.painting.year
      });
    });
  }

  onSubmit() {
    if (this.paintingForm.valid) {
      const artistId = this.route.snapshot.params[environment.urlArtistId];
      const paintingId = this.route.snapshot.params[environment.urlPaintingId];

      this.artistService.editPainting(artistId, paintingId, this.paintingForm).subscribe({

        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);

        },
        complete: () => {
          this._router.navigate([environment.artistsUrl + artistId]);
        }
      }
      );
    }
  }
  goBack() {
    const artistId = this.route.snapshot.params[environment.urlArtistId];
    this._router.navigate([environment.artistsUrl + artistId]);
  }
}
