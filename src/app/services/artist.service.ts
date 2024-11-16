import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {

  constructor(private http: HttpClient) {}

  searchArtists(query: string): Observable<{ id: number, nome: string }[]> {
    return this.http.get<{ id: number, nome: string }[]>(`${environment.apiBaseUrl}/artist/search`, {
      params: { query },
    });
  }
}
