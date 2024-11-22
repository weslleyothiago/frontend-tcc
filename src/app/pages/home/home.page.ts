import { Component, OnInit } from '@angular/core';
import {jwtDecode} from 'jwt-decode'; // Corrigir a importação
import { MusicService } from 'src/app/services/music.service'; // Certifique-se de ajustar o caminho corretamente

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  musicList: any[] = [];
  isAdmin: boolean = false;

  constructor(private musicService: MusicService) {}

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
}
