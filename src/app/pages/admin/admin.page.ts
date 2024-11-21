import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { ModalController } from '@ionic/angular';
import { MusicDeletionComponent, } from 'src/app/components/music-deletion/music-deletion.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html'  // Ajuste o caminho se necessário
})
export class AdminPage implements OnInit{
  musicas: any[] = [];
  artistas: any[] = []
  usuarios: any[] = [];

  currentTable = 'musicas'; 
  searchType = '';
  linkCopied: boolean = false;

  constructor(
    private modalController: ModalController,
    private datePipe: DatePipe,
    private musicService: MusicService,
    private router: Router
  ) {}

  ngOnInit(){
    this.fetchMusicas()
    this.setCurrentTable('musicas')
  }

  // Método que será chamado quando o botão for clicado
  onCopyClick(link: string): void {
    this.copyLink(link);  
    this.linkCopied = true;

    setTimeout(() => {
      this.linkCopied = false;
    }, 2000);
  }

  // Método que copia o link para a área de transferência
  copyLink(link: string): void {
    if (!link) {
      console.warn('Nenhum link disponível para copiar.');
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = link;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  async openDeleteModal() {
    const modal = await this.modalController.create({
      component: MusicDeletionComponent,
      cssClass: 'backdrop-blur-3xl',
    });
    return await modal.present();
  }

  async openRegisterModal() {
    const modal = await this.modalController.create({
      component: RegisterComponent,
      cssClass: 'backdrop-blur-3xl',
      componentProps: {
        userType: 'Administrador'
      }
    });
    return await modal.present();
  }

  setCurrentTable(table: string): void {
    this.currentTable = table

  if (this.currentTable === 'musicas') {
    this.searchType = 'titulo';  
  } else if (this.currentTable === 'usuarios') {
    this.searchType = 'nome';  
    }
  
    if (this.currentTable === 'musicas') {
      this.fetchMusicas();
    } else if (this.currentTable === 'usuarios') {
    }
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
    } else if (this.currentTable === 'usuarios') {
      this.openRegisterModal()
    }
  }

  navigateToAddMusic() {
    this.router.navigate(['/admin/musics']);
  }

  get currentData() {
    return this.currentTable === 'musicas' ? this.musicas : this.usuarios;
  }

  get currentColumns() {
    return this.currentTable === 'musicas'
      ? [
          { label: 'Título', key: 'titulo' },
          { label: 'Link', key: 'link' },
          { label: 'Artista', key: 'artistas' },
          { label: 'Gênero', key: 'genero' },
          { label: 'Data de Cadastro', key: 'createdAt' },
          { label: 'Ações', key: 'acoes' },
        ]
      : [
          { label: 'Nome', key: 'nome' },
          { label: 'Email', key: 'email' },
          { label: 'Tipo', key: 'tipo' },
          { label: 'Data de Registro', key: 'createdAt' }
        ];
  }
  
    getFilterOptions() {
      if (this.currentTable === 'musicas') {
        return [
          { value: 'titulo', label: 'Música' },
          { value: 'artistas', label: 'Artista' },
        ];
      } else if (this.currentTable === 'usuarios') {
        return [
          { value: 'nome', label: 'Nome' },
          { value: 'tipo', label: 'Tipo' },
        ];
      }
      return [];
    }

  get actionButtonLabel() {
    return this.currentTable === 'musicas' ? 'Adicionar música' : 'Registrar administrador';
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
