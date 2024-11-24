import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private readonly baseUrl = 'http://localhost:3000/playlists'; // URL base para as rotas do backend

  constructor(private http: HttpClient) {}

  /**
   * Cria uma nova playlist
   * @param title Título da playlist
   * @param coverImage URL da capa da playlist
   * @returns Observable com os dados da playlist criada
   */
  createPlaylist(title: string, coverImage: string): Observable<any> {
    const payload = { title, coverImage };
    return this.http.post(`${this.baseUrl}`, payload);
  }

  /**
   * Adiciona músicas a uma playlist existente
   * @param playlistId ID da playlist
   * @param perfilId ID do perfil
   * @param musicIds Lista de IDs das músicas a serem adicionadas
   * @returns Observable com a resposta do backend
   */
  addMusicToPlaylist(
    playlistId: number,
    perfilId: number,
    musicIds: number[]
  ): Observable<any> {
    const payload = { perfilId, musicIds };
    return this.http.post(`${this.baseUrl}/${playlistId}/add-music`, payload);
  }
}
