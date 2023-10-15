import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Painting } from './painting.service';

@Injectable({
  providedIn: 'root'
})
export class PaintingDataService {
  baseUrl: string = "http://localhost:3000/api/artists/65234f8f93c4bb6a9c5bfc75";

  public getPaintings(): Observable<Painting[]> {
    return this.http.get<Painting[]>(this.baseUrl + '/paintings');
  }
  public getPainting(id:string):Observable<Painting>{
    const url: string = this.baseUrl + '/paintings/' + id;
    return this.http.get<Painting>(url);
  }
  constructor(private http: HttpClient) { }
}
