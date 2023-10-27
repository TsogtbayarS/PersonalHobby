import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ArtistDataService } from '../artist-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Artist } from '../artist.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-edit-artist',
  templateUrl: './edit-artist.component.html',
  styleUrls: ['./edit-artist.component.css']
})
export class EditArtistComponent implements OnInit {
  artistForm: FormGroup;
  artist: Artist;

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private artistService: ArtistDataService
  ) {
    this.artist = new Artist("", "", "", []);
    this.artistForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const artistId = this.route.snapshot.params[environment.urlArtistId];
    this.artistService.getArtist(artistId).subscribe(artist => {
      this.artist = artist;
      this.artistForm.patchValue({
        id: this.artist._id,
        name: this.artist.name,
        country: this.artist.country,
        paintings: this.artist.paintings
      });
    });
  }

  onSubmit() {
    if (this.artistForm.valid) {
      this.artistService.editArtist(this.artistForm).subscribe({
        next: () => {
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this._router.navigate([environment.artists]);
        }
      }
      );
    }
  }
  goBack() {
    this._router.navigate([environment.artistsUrl]);
  }
}
