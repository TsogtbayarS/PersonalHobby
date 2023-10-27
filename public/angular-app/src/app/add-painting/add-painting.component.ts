import { Component } from '@angular/core';
import { ArtistDataService } from '../artist-data.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-painting',
  templateUrl: './add-painting.component.html',
  styleUrls: ['./add-painting.component.css']
})
export class AddPaintingComponent {
  constructor(private artistService: ArtistDataService, private route: ActivatedRoute, private router: Router) { }
  onSubmit(form: NgForm) {
    if (form.valid) {
      const artistId = this.route.snapshot.params[environment.urlArtistId];
      this.artistService.addPainting(artistId, form.value).subscribe({
        next: () => {

        },
        error: (error) => {
          console.log(error);

        },
        complete: () => {
          this.router.navigate([environment.artistsUrl + artistId])
        }
      })
    }
  }
  goBack() {
    this.router.navigate([environment.artistsUrl]);
  }

}
