import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Artist } from './artist.service';
import { Painting } from './painting.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistDataService {
  baseUrl: string = "http://localhost:3000/api";

  public getArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.baseUrl + '/artists');
  }
  public getArtist(id:string):Observable<Artist>{
    const url: string = this.baseUrl + '/artists/' + id;
    return this.http.get<Artist>(url);
  }
  

  public getPaintings(): Observable<Painting[]> {
    return this.http.get<Painting[]>(this.baseUrl + '/paintings');
  }
  public getPainting(artistId : string ,id:string):Observable<Painting>{
    const url: string = this.baseUrl + '/artists/' + artistId + '/paintings/' + id;
    return this.http.get<Painting>(url);
  }
  constructor(private http: HttpClient) { }
}
