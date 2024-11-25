import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist-musics',
  templateUrl: './playlist-musics.component.html',
  styleUrls: ['./playlist-musics.component.scss'],
})
export class PlaylistMusicsComponent implements OnInit {
  @Input() playlist: any; // Recebendo a playlist selecionada
  @Input() randomGradient: string = '';
  searchText: string = ''; // Texto de busca

  constructor() {}

  ngOnInit(): void {}

  // Função para filtrar as músicas com base no texto de busca
  get filteredMusics(): any[] {
    if (!this.searchText) {
      return this.playlist.songs || [];
    }
    const search = this.searchText.toLowerCase();
    return (this.playlist.songs || []).filter(
      (music: any) =>
        music.titulo?.toLowerCase().includes(search) ||
        music.artista?.toLowerCase().includes(search)
    );
  }
}
