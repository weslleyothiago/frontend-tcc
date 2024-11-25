import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-playlist-musics',
  templateUrl: './playlist-musics.component.html',
  styleUrls: ['./playlist-musics.component.scss'],
})
export class PlaylistMusicsComponent implements OnInit {
  @Input() playlist: any; // Recebe a playlist selecionada
  @Input() randomGradient: string = ''; // Gradiente de fundo
  searchText: string = ''; // Texto da busca
  currentVideoUrl: SafeResourceUrl | null = null; // URL do vídeo embed em formato seguro
  @ViewChild('videoIframe') videoIframe!: ElementRef<HTMLIFrameElement>;

  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  // Filtra as músicas com base no texto de busca
  get filteredMusics(): any[] {
    if (!this.searchText) {
      return this.playlist?.songs || [];
    }
    const search = this.searchText.toLowerCase();
    return (this.playlist?.songs || []).filter(
      (music: any) =>
        music.titulo?.toLowerCase().includes(search) ||
        music.artista?.toLowerCase().includes(search)
    );
  }

  // Obtém os nomes dos artistas da música
  getArtistNames(musicaArtista: any[]): string {
    if (!musicaArtista || musicaArtista.length === 0) {
      return 'Artista desconhecido';
    }
    return musicaArtista.map((artistaRel) => artistaRel.artista.nome).join(', ');
  }

  // Abre o vídeo em fullscreen no iframe
  playVideoInFullscreen(link: string): void {
    const embedUrl = this.transformYouTubeLink(link);
    this.currentVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // Fecha o vídeo fullscreen
  closeVideo(): void {
    this.currentVideoUrl = null;
  }

  // Converte um link do YouTube em formato embed
  private transformYouTubeLink(link: string): string {
    const url = new URL(link);
    const videoId = url.searchParams.get('v'); // Obtém o ID do vídeo do parâmetro 'v'
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
}
