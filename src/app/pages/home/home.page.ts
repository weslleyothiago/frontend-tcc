import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { jwtDecode } from 'jwt-decode';
import { PlaylistCreateComponent } from 'src/app/components/playlist-create/playlist-create.component';
import { MusicService } from 'src/app/services/music.service'; 
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  errorMessage: string = '';
  playlists: any[] = [];
  musicList: any[] = [];
  isAdmin: boolean = false;

  constructor(
    private playlistService: PlaylistService,
    private musicService: MusicService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.loadPlaylists();
    this.loadMusics();
    this.checkUserType();
  }

  // Método para carregar músicas do backend
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

  // Método para verificar o tipo de usuário com base no token
  checkUserType(): void {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decodificar o token
        this.isAdmin = decodedToken.type === 'Administrador';
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        this.isAdmin = false;
      }
    } else {
      console.warn('Token não encontrado.');
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

  loadPlaylists(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (data: any) => {
        this.playlists = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar playlists:', err.message);
        this.errorMessage = 'Erro ao carregar playlists';
      },
    });
  }
}
