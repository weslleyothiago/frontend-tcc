import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CreatePlaylistDto {
  title: string;
  coverImage?: string;
  slug?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {

  constructor(private http: HttpClient) {}

  createPlaylist(dto: CreatePlaylistDto, profileId: number): Observable<any> {
    const payload = { ...dto, profileId }; // Inclui o `profileId` no payload
    return this.http.post<any>(`${environment.apiBaseUrl}/playlists`, payload);
  }

  getPlaylistsByProfile(profileId: number) {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/playlists/profile/${profileId}`);
  }
}
