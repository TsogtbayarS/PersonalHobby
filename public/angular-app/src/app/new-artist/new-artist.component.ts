import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ArtistDataService } from '../artist-data.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-new-artist',
  templateUrl: './new-artist.component.html',
  styleUrls: ['./new-artist.component.css']
})
export class NewArtistComponent {
  constructor(private artistService: ArtistDataService, private router: Router) { }
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.artistService.addArtist(form.value).subscribe({
        next: () => {
          form.resetForm();
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.router.navigate([environment.artists])
        }
      })
    }
  }
  goBack() {
    this.router.navigate([environment.artistsUrl]);
  }
}
