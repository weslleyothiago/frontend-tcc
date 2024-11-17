import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {

  baseUrl = `${environment.apiBaseUrl}/artist`

  constructor(private http: HttpClient) {}

  searchArtists(query: string): Observable<{ id: number, nome: string }[]> {
    return this.http.get<{ id: number, nome: string }[]>(`${this.baseUrl}/search`, {
      params: { query },
    });
  }

    // Função para criar um novo artista
    create(artistData: { nome: string }): Observable<any> {
      return this.http.post<any>(this.baseUrl, artistData);
    }
}
