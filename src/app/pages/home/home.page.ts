import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {jwtDecode} from 'jwt-decode';
import { PlaylistCreateComponent } from 'src/app/components/playlist-create/playlist-create.component';
import { MusicService } from 'src/app/services/music.service'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  musicList: any[] = [];
  isAdmin: boolean = false;

  constructor(
    private musicService: MusicService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
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
    }
    console.log('Usuário é administrador:', this.isAdmin);
  }

   async openCreatePlaylistModal() {  
    const modal = await this.modalController.create({
      component: PlaylistCreateComponent, 
      cssClass: 'backdrop-blur-sm',
    });
    return await modal.present();
  }

}
