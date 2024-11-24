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

  private getProfileIdFromToken(): number | null {
    const token = sessionStorage.getItem('access_token'); // Obtem o JWT do sessionStorage
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
      return decoded?.profileId || null; // Retorna o profileId
    }
    return null; // Se o token não existir
  }

  // Faz a requisição para buscar as playlists com base no profileId
  getPlaylists(): any {
    const profileId = this.getProfileIdFromToken();
    if (!profileId) {
      throw new Error('Profile ID não encontrado no token.');
    }
    // Envia o profileId diretamente na URL ou no corpo da requisição
    return this.http.get(`${environment.apiBaseUrl}/playlists/profile/${profileId}`);
  }
}
