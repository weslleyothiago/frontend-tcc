import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { jwtDecode } from 'jwt-decode';
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
  playlists: any[] = [];
  musicList: any[] = [];
  errorMessage: string = '';
  selectedPlaylist: any = null; // Playlist selecionada
  isAdmin: boolean = false;

  constructor(
    private playlistService: PlaylistService,
    private musicService: MusicService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.loadMusics();
    this.loadPlaylists();
    this.checkUserType();
  }

  loadMusics(): void {
    this.musicService.getMusicas().subscribe(
      (data) => {
        this.musicList = data;
      },
      (error) => {
        console.error('Erro ao carregar músicas:', error);
        this.errorMessage = 'Erro ao carregar músicas. Tente novamente mais tarde.';
      }
    );
  }

  loadPlaylists(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (data: any) => {
        this.playlists = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar playlists:', err.message);
      },
    });
  }

  selectPlaylist(playlist: any) {
    this.selectedPlaylist = playlist;
  }

  checkUserType(): void {
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

  async openCreatePlaylistModal() {
    const modal = await this.modalController.create({
      component: PlaylistCreateComponent,
      cssClass: 'backdrop-blur-sm',
    });
    return await modal.present();
  }
}
