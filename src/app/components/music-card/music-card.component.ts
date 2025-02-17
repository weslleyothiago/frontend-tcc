import { Component, Input, ElementRef, ViewChild, HostListener } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-music-card',
  templateUrl: './music-card.component.html',
  styleUrls: ['./music-card.component.scss'],
})
export class MusicCardComponent {
  @Input() title: string = ''; // Título da música
  @Input() artist: string = ''; // Nome do artista
  @Input() videoUrl: string = ''; // URL do vídeo
  @Input() thumbnail: string = ''; // URL da thumbnail
  @Input() musicaId: number = 0; // ID da música

  @ViewChild('videoIframe') videoIframe!: ElementRef<HTMLIFrameElement>;

  playlists: any[] = []; // Playlists carregadas
  contextMenuVisible: boolean = false; // Controle de visibilidade do menu de contexto
  contextMenuPosition = { x: 0, y: 0 }; // Posição do menu de contexto
  selectedMusicaId: number | null = null; // Armazenar o ID da música selecionada
  showSubMenu: boolean = false; // Controle de exibição do sub-menu de playlists
  isIframeLoaded: boolean = false;
  
  toastVisible: boolean = false; // Controle de visibilidade do Toast
  toastMessage: string = ''; // Mensagem do Toast

  constructor(private playlistService: PlaylistService, private elementRef: ElementRef) {}

  ngOnInit() {
    this.loadPlaylists(); // Carrega as playlists ao iniciar o componente
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

  // Método para abrir o menu de contexto e capturar o ID da música
  openContextMenu(event: MouseEvent, musicaId: number): void {
    event.preventDefault();
    this.selectedMusicaId = musicaId; // Armazenar o ID da música clicada
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
  }

  // Método para fechar o menu de contexto
  closeContextMenu(): void {
    this.contextMenuVisible = false;
    this.showSubMenu = false;
  }

  // Fechar o menu de contexto ao clicar fora
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeContextMenu();
    }
  }

  // Método para adicionar música à playlist e mostrar feedback
  addToPlaylist(playlistId: number): void {
    if (this.selectedMusicaId !== null) {
      this.playlistService.addToPlaylist(playlistId, this.selectedMusicaId).subscribe({
        next: (response) => {
          console.log('Música adicionada:', response);
          this.showToast('Música adicionada à playlist!');
        },
        error: (error) => {
          console.error('Erro ao adicionar música:', error);
          this.showToast('Erro ao adicionar música!');
        }
      });
    }
  }

  // Exibir o Toast
  showToast(message: string): void {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 3000); // Toast desaparece após 3 segundos
  }

  // Método para carregar o vídeo e definir o musicaId dinamicamente
  loadVideo(musicaId: number): void {
    this.selectedMusicaId = musicaId;
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
    event.stopPropagation();

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
