import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {jwtDecode} from 'jwt-decode'; // Certifique-se de importar corretamente
import { PlaylistService } from 'src/app/services/playlist.service';
import { MusicService } from 'src/app/services/music.service';
import { PlaylistCreateComponent } from 'src/app/components/playlist-create/playlist-create.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  playlists: any[] = []; // Lista de playlists do usuário
  musicList: any[] = []; // Todas as músicas
  filteredMusicList: any[] = []; // Músicas filtradas pela busca
  categorizedMusic: { genero: string; musics: any[] }[] = []; // Músicas categorizadas por gênero
  errorMessage: string = ''; // Mensagem de erro para feedback
  selectedPlaylist: any = null; // Playlist selecionada
  isAdmin: boolean = false; // Determina se o usuário é administrador
  randomGradient: string = ''; // Gradiente gerado aleatoriamente
  searchQuery: string = ''; // Busca do usuário

  constructor(
    private playlistService: PlaylistService,
    private musicService: MusicService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.initializePage();
  }

  /**
   * Inicializa os dados necessários na página.
   */
  private initializePage(): void {
    this.randomGradient = this.generateRandomGradient();
    this.checkUserType();
    this.loadMusics();
    this.loadPlaylists();
  }

  /**
   * Filtra as músicas com base na pesquisa do usuário.
   */
  filterMusics(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredMusicList = this.musicList; // Exibe todas as músicas se não houver busca
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredMusicList = this.musicList.filter((music) =>
        music.titulo.toLowerCase().includes(query) ||
        (music.MusicaArtista?.[0]?.artista?.nome || '').toLowerCase().includes(query)
      );
      this.categorizeMusics(); // Reaplica a categorização nos resultados filtrados
    }
  }

  /**
   * Gera um gradiente aleatório para a página.
   */
  private generateRandomGradient(): string {
    const randomPurple = this.getRandomPurpleColor();
    return `linear-gradient(to right, ${randomPurple}, black)`;
  }
  
  /**
   * Retorna uma cor roxa hexadecimal aleatória.
   */
  private getRandomPurpleColor(): string {
    const red = this.getRandomHex(128, 255);   // Red deve ser um valor mais alto para roxo
    const green = this.getRandomHex(0, 128);   // Green deve ser mais baixo para roxo
    const blue = this.getRandomHex(128, 255);  // Blue também deve ser um valor mais alto para roxo
    
    return `#${red}${green}${blue}`;
  }
  
  /**
   * Gera um valor hexadecimal aleatório dentro de um intervalo.
   */
  private getRandomHex(min: number, max: number): string {
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    return value.toString(16).padStart(2, '0'); // Garante que o valor tenha 2 caracteres hexadecimais
  }

  /**
   * Carrega a lista de músicas do serviço.
   */
  private loadMusics(): void {
    this.musicService.getMusicas().subscribe({
      next: (data: any[]) => {
        this.musicList = data;
        this.filteredMusicList = [...data];
        this.categorizeMusics();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar músicas:', error.message);
        this.errorMessage = 'Erro ao carregar músicas. Tente novamente mais tarde.';
      },
    });
  }

  /**
   * Agrupa as músicas por gênero.
   */
  private categorizeMusics(): void {
    const categories: { [key: string]: any[] } = {};

    this.filteredMusicList.forEach((music) => {
      const genre = music.generoMusical?.generoMusical || 'Sem gênero';
      if (!categories[genre]) {
        categories[genre] = [];
      }
      categories[genre].push(music);
    });

    this.categorizedMusic = Object.keys(categories).map((genre) => ({
      genero: genre,
      musics: categories[genre],
    }));
  }

  /**
   * Carrega a lista de playlists do serviço.
   */
  private loadPlaylists(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (data: any[]) => {
        this.playlists = data.map((playlist) => ({
          ...playlist,
          songs: playlist.PlaylistMusica.map((pm: any) => pm.musica), // Extrai as músicas
        }));
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar playlists:', err.message);
      },
    });
  }

  /**
   * Exibe todas as músicas quando nenhuma playlist está selecionada.
   */
  showDefaultMusic(): void {
    this.selectedPlaylist = null;
  }

  /**
   * Seleciona uma playlist para exibição.
   */
  selectPlaylist(playlist: any): void {
    this.selectedPlaylist = playlist;
    this.randomGradient = this.generateRandomGradient();
  }

  /**
   * Verifica o tipo de usuário com base no token JWT.
   */
  private checkUserType(): void {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.isAdmin = decodedToken.type === 'Administrador';
      } catch (error) {
        this.isAdmin = false;
      }
    } else {
      this.isAdmin = false;
    }
  }

  /**
   * Abre o modal para criar uma nova playlist.
   */
  async openCreatePlaylistModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: PlaylistCreateComponent,
      cssClass: 'backdrop-blur-sm',
    });
    return modal.present();
  }
}
