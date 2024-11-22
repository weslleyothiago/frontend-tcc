import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';

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

  isIframeLoaded: boolean = false;

  loadVideo(): void {
    // Adiciona autoplay na URL
    this.videoUrl = `${this.videoUrl}?autoplay=1`;
    this.isIframeLoaded = true;

    // Aguarda um breve delay para garantir que o iframe foi renderizado
    setTimeout(() => {
      this.enterFullscreen();
    }, 300);
  }

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

    // Reseta o estado do iframe
    this.isIframeLoaded = false;
  }

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange(): void {
    if (!document.fullscreenElement) {
      this.isIframeLoaded = false; // Sai do modo tela cheia
    }
  }
}
