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

  create(music: Music): Observable<Music> {
    return this.http.post<Music>(this.baseUrl, music);
  }

    createMusicArtistRelation(musicId: number, artistId: number): Observable<any> {
      const url = `${this.baseUrl}/music-artist`;
      const body = { musicId, artistId };
      return this.http.post<any>(url, body);
    }

  getMusicas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
