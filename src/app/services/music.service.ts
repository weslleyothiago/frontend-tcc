import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Music } from '../models/music.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private url = `${environment.apiBaseUrl}/musics`;

  constructor(private http: HttpClient) {}

  create(music: Music): Observable<Music> {
    return this.http.post<Music>(this.url, music);
  }

  getGenres(): Observable<string[]> {
    return this.http.get<string[]>(this.url);
  }
}
