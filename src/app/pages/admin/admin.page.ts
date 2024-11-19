import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html'  // Ajuste o caminho se necessário
})
export class AdminPage implements OnInit{
  musicas: any[] = [];
  artistas: any[] = []
  usuarios: any[] = [];

  // Estado atual
  currentTable = 'musicas'; // ou 'usuarios'

  constructor(
    private datePipe: DatePipe,
    private musicService: MusicService,
    private router: Router
  ) {}

  ngOnInit(){
    this.fetchMusicas()
  }

  getPlaceholder(): string {
    switch (this.currentTable) {
      case 'musicas':
        return 'Cante, dance e procure a trilha sonora perfeita!';
      case 'usuarios':
        return 'Procurando aquele usuário especial para a festa?';
      default:
        return '';
    }
  }

  onActionButtonClick() {
    if (this.currentTable === 'musicas') {
      this.navigateToAddMusic();
      console.log('está no músicas')
    } else if (this.currentTable === 'usuarios') {
      this.navigateToAddUser();
      console.log('está no Usuários')
    }
  }

  navigateToAddMusic() {
    this.router.navigate(['/admin/musics']);  // Redireciona para a tela de adicionar música
  }

  navigateToAddUser() {
    this.router.navigate(['/admin/users']);  // Redireciona para a tela de adicionar usuário
  }

  get currentData() {
    return this.currentTable === 'musicas' ? this.musicas : this.usuarios;
  }

  get currentColumns() {
    return this.currentTable === 'musicas'
      ? [
          { label: 'Título', key: 'titulo' },
          { label: 'Artista', key: 'artistas' },
          { label: 'Gênero', key: 'genero' },
          { label: 'Data de Cadastro', key: 'createdAt' }
        ]
      : [
          { label: 'Nome', key: 'nome' },
          { label: 'Email', key: 'email' },
          { label: 'Tipo', key: 'tipo' },
          { label: 'Data de Registro', key: 'createdAt' }
        ];
  }
  
  

  get actionButtonLabel() {
    return this.currentTable === 'musicas' ? 'Adicionar música' : 'Registrar administrador';
  }

  onDeleteMusica(musica: any) {
    console.log('Deletar música:', musica);
  }

  fetchMusicas() {
    this.musicService.getMusicas().subscribe(
      (data) => {
        this.musicas = data.map((musica: any) => {
          const artistas = musica.MusicaArtista?.map((ma: any) => ma.artista?.nome).join(', ');

          // Formatar a data
          const dataFormatada = this.datePipe.transform(musica.createdAt, 'dd/MM/yyyy');

          return {
            ...musica,
            genero: musica.generoMusical?.generoMusical,
            artistas,
            createdAt: dataFormatada, // Adicione a data formatada aqui
          };
        });
      },
      (error) => {
        console.error('Erro ao buscar músicas:', error);
      }
    );
  }
  
  

}
