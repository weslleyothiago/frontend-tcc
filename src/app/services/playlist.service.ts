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



  createPlaylist(dto: CreatePlaylistDto): Observable<any> {
    // Recupera o profileId do token armazenado
    const profileId = this.getProfileIdFromToken(); // Supondo que essa função já exista
  
    if (!profileId) {
      throw new Error('Profile ID não encontrado no token.');
    }
  
    const payload = { ...dto, profileId }; // Inclui o profileId no payload
    return this.http.post<any>(`${environment.apiBaseUrl}/playlists`, payload);
  }
  
  private getProfileIdFromToken(): number | null {
    const token = sessionStorage.getItem('access_token'); // Substitua pelo local onde o token é armazenado
    if (!token) return null;
  
    try {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decodifica o JWT
      return decoded?.profileId || null; // Retorna o profileId, caso exista
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }
  

  getPlaylistsByProfile(profileId: number) {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/playlists/profile/${profileId}`);
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

  addToPlaylist(playlistId: number, musicaId: number): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/playlists/add-to-playlist`, { playlistId, musicaId });
  }
}
