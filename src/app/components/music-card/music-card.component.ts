import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ElementRef, ViewChild, HostListener } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-music-card',
  templateUrl: './music-card.component.html',
  styleUrls: ['./music-card.component.scss'],
})
export class MusicCardComponent {
  @Input() title: string = ''; // Título do vídeo
  @Input() artist: string = ''; // Nome do artista
  @Input() videoUrl: string = ''; // URL do vídeo
  @Input() thumbnail: string = ''; // URL da thumbnail

  @ViewChild('videoIframe') videoIframe!: ElementRef<HTMLIFrameElement>;

  playlists: any[] = [];  // Playlists carregadas
  contextMenuVisible: boolean = false;  // Controle de visibilidade do menu de contexto
  contextMenuPosition = { x: 0, y: 0 };  // Posição do menu de contexto
  showSubMenu: boolean = false;  // Controle de exibição do sub-menu de playlists
  isIframeLoaded: boolean = false;

  constructor(private playlistService: PlaylistService, private elementRef: ElementRef) {}

  ngOnInit() {
    this.loadPlaylists();  // Carrega as playlists quando o componente é inicializado
  }

  // Método para carregar as playlists
  loadPlaylists(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (data: any) => {
        this.playlists = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar playlists:', err);
      }
    });
  }

  // Método para abrir o menu de contexto
  openContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
  }

  // Método para fechar o menu de contexto
  closeContextMenu(): void {
    this.contextMenuVisible = false;
    this.showSubMenu = false;
  }

  // Adicionar música à playlist
  addToPlaylist(playlistId: number): void {
    console.log(`Adicionar música à playlist ID: ${playlistId}`);
    // Faça a chamada para a API ou lógica para adicionar música à playlist
    this.closeContextMenu();
  }

  // Fechar o menu de contexto ao clicar fora
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeContextMenu();
    }
  }

  // Método para carregar o vídeo em tela cheia
  loadVideo(): void {
    this.videoUrl = `${this.videoUrl}?autoplay=1`;
    this.isIframeLoaded = true;

    setTimeout(() => {
      this.enterFullscreen();
    }, 300);
  }

  // Entrar no modo tela cheia
  enterFullscreen(): void {
    const iframeElement = this.videoIframe.nativeElement;

    if (iframeElement.requestFullscreen) {
      iframeElement.requestFullscreen();
    } else if ((iframeElement as any).webkitRequestFullscreen) {
      (iframeElement as any).webkitRequestFullscreen();
    } else if ((iframeElement as any).mozRequestFullScreen) {
      (iframeElement as any).mozRequestFullScreen();
    } else if ((iframeElement as any).msRequestFullscreen) {
      (iframeElement as any).msRequestFullscreen();
    }
  }

  // Sair do modo tela cheia
  exitFullscreen(event: Event): void {
    event.stopPropagation(); // Impede que o clique feche o card ao sair da tela cheia

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }

    this.isIframeLoaded = false;
  }

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange(): void {
    if (!document.fullscreenElement) {
      this.isIframeLoaded = false; // Sai do modo tela cheia
    }
  }
}
