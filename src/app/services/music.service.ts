import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Music } from '../models/music.model'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private baseUrl = `${environment.apiBaseUrl}/musics`;

  constructor(private http: HttpClient) {}

  createMusicWithArtistRelation(
    music: Music,
    artistId: number
  ): Observable<any> {
    const body = {
      music,
      artistRelation: { artistaId: artistId },
    };
    return this.http.post<any>(this.baseUrl, body);
  }
  

  getMusicas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
