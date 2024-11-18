import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html'  // Ajuste o caminho se necessário
})
export class AdminPage implements OnInit{
  musicas: any[] = [];
  artistas: any[] = []

  constructor(private musicService: MusicService) {}

  ngOnInit(){
    this.fetchMusicas()
  }

  fetchMusicas() {
    this.musicService.getMusicas().subscribe(
      (data) => {
        this.musicas = data;
      },
      (error) => {
        console.error('Erro ao buscar músicas:', error);
      }
    );
  }

}
