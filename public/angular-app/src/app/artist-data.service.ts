import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { Artist } from './artist.service';
import { Painting } from './painting.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ArtistDataService {
  baseUrl: string = environment.apiEndpoint;

  public getArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.baseUrl + environment.slashArtists);
  }
  public getArtist(id: string): Observable<Artist> {
    const url: string = this.baseUrl + environment.artistsWith2Slash + id;
    return this.http.get<Artist>(url);
  }

  public addArtist(artist: Artist): Observable<Artist> {
    return this.http.post<Artist>(this.baseUrl + environment.slashArtists, artist);
  }

  public editArtist(artist: FormGroup): Observable<Artist> {
    return this.http.patch<Artist>(this.baseUrl + environment.artistsWith2Slash + artist.value.id, artist.value)
  }

  public deleteArtist(artistId: string): Observable<Artist> {
    const url: string = this.baseUrl + environment.artistsWith2Slash + artistId;
    return this.http.delete<Artist>(url)
  }

  public getPaintings(): Observable<Painting[]> {
    return this.http.get<Painting[]>(this.baseUrl + environment.slashPaintings);
  }
  public getPainting(artistId: string, id: string): Observable<Painting> {
    const url: string = this.baseUrl + environment.artistsWith2Slash + artistId + environment.paintingsWith2Slash + id;
    return this.http.get<Painting>(url);
  }
  public addPainting(artistId: string, painting: Painting): Observable<Painting> {
    const url: string = this.baseUrl + environment.artistsWith2Slash + artistId + environment.paintingsWith2Slash;
    return this.http.post<Painting>(url, painting);
  }

  public editPainting(artistId: string, paintingId: string, painting: FormGroup): Observable<Painting> {
    const url: string = this.baseUrl + environment.artistsWith2Slash + artistId + environment.paintingsWith2Slash + paintingId;
    return this.http.put<Painting>(url, painting.value)
  }
  public deletePainting(artistId: string, id: string): Observable<Painting> {
    const url: string = this.baseUrl + environment.artistsWith2Slash + artistId + environment.paintingsWith2Slash + id;
    const token = localStorage.getItem(environment.token);
    return this.http.delete<Painting>(url, { headers: { authorization: environment.bearerWithSpace + token } })
  }
  constructor(private http: HttpClient) { }
}
