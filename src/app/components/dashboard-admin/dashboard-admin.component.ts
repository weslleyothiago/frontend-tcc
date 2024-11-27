import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MusicService } from 'src/app/services/music.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss'],
})
export class DashBoardAdminComponent implements OnInit{
  @Input() header: string = '';
  @Input() subtitle: string = '';
  @Input() columns: { label: string; key: string }[] = [];
  @Input() data: any[] = [];
  @Input() actionButtonLabel: string = '';
  @Input() actionButtonIcon: string = 'add-outline';
  @Input() deleteAction?: (item: any) => void;
  @Input() placeholder: string = '';
  @Input() searchType: string = '';
  @Input() filterOptions: { value: string, label: string }[] = [];
  @Input() boolLink: boolean = true;
  @Output() actionButtonClick = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() linkCopied = new EventEmitter<string>();

  searchText: string = ''; // Adicione esta variável
  musics: any[] = []; // Array para armazenar as músicas

  ngOnInit() {
  }

  constructor(
    private musicService: MusicService, // Injete o serviço para manipular músicas
    private alertController: AlertController // Opcional para exibir alertas
  ) {}

  // Função para lidar com a busca
  get filteredData(): any[] {
    if (!this.searchText) {
      return this.data;
    }

    const search = this.searchText.toLowerCase();
    return this.data.filter(item =>
      item?.[this.searchType]?.toLowerCase().includes(search)
    );
  }


  async deleteMusic(music: any) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir a música <strong>${music.titulo}</strong>?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.musicService.deleteMusicById(music.id).subscribe({
              next: () => {
                console.log(`Música com ID ${music.id} excluída com sucesso!`);
              },
              error: (err) => console.error('Erro ao excluir música:', err),
            });
          },
        },
      ],
    });
  
    await alert.present();
  }
  

  onCopyClick(link: string,) {
    this.linkCopied.emit(link)
    console.log('Dashboard: '+this.boolLink)
  }

  onDeleteClick(): void {
    this.deleteItem.emit();
  }

  onActionClick(): void {
    this.actionButtonClick.emit();
  }

}