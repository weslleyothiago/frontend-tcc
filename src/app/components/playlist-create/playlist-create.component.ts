import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-playlist-create',
  templateUrl: './playlist-create.component.html',
  styleUrls: ['./playlist-create.component.scss'],
})
export class PlaylistCreateComponent  implements OnInit {

  previewImage: string | null = null; // Para armazenar o caminho da imagem carregada
  playlistForm!: FormGroup;
  
  constructor(
    private toastCtrl: ToastController,
    private playlistService: PlaylistService,
    private fb: FormBuilder,
    private modalController: ModalController,
  ) { }
  
  ngOnInit() {
    this.playlistForm = this.fb.group({
      title: ['', Validators.required],  // Define o validador para o título
    });
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewImage = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }


  savePlaylist(): void {
    if (this.playlistForm.invalid) return;

    const data = {
      title: this.playlistForm.get('title')?.value,
      coverImage: this.previewImage,
      perfilId: 1, // Substitua pelo ID do perfil do usuário autenticado
      musicIds: [], // IDs de músicas selecionadas (se necessário)
    };
  }

    async createPlaylist() {
      try {
        const { title, fileInput } = this.playlistForm.value;
    
        const response = await this.playlistService.createPlaylist(title, fileInput).toPromise();
    
        const toast = await this.toastCtrl.create({
          message: 'Playlist criada com sucesso!',
          duration: 2000,
          color: 'success',
        });
    
        await toast.present();
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'Erro ao criar playlist.',
          duration: 2000,
          color: 'danger',
        });
    
        await toast.present();
      }
    }
    


  
}
