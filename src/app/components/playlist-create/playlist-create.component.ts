import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-playlist-create',
  templateUrl: './playlist-create.component.html',
  styleUrls: ['./playlist-create.component.scss'],
})
export class PlaylistCreateComponent implements OnInit {
  previewImage: string | null = null; // Para armazenar o caminho da imagem carregada
  playlistForm!: FormGroup;

  constructor(
    private toastCtrl: ToastController,
    private playlistService: PlaylistService,
    private fb: FormBuilder,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.playlistForm = this.fb.group({
      title: ['', Validators.required], // Campo obrigatório para o título
      coverImage: [null], // Campo opcional para a capa da playlist
    });
  }

  /**
   * Manipula a seleção do arquivo e armazena a imagem como base64.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewImage = e.target?.result as string;
        this.playlistForm.patchValue({ coverImage: this.previewImage });
      };

      reader.readAsDataURL(file);
    }
  }

  /**
   * Fecha o modal.
   */
  closeModal() {
    this.modalController.dismiss();
  }

  /**
   * Envia o formulário para criar a playlist.
   */
  createPlaylist() {
    if (this.playlistForm.invalid) {
      this.showToast('Por favor, preencha os campos obrigatórios.');
      return;
    }
  
    const playlistData = this.playlistForm.value;
  
    // Supondo que o profileId já foi recuperado do token ao carregar o componente
    this.playlistService.createPlaylist(playlistData).subscribe({
      next: (response) => {
        console.log('Playlist criada com sucesso:', response);
        this.showToast('Playlist criada com sucesso!');
        this.closeModal(); // Fecha o modal após criar a playlist
      },
      error: (error) => {
        console.error('Erro ao criar playlist:', error);
        this.showToast('Erro ao criar playlist. Tente novamente.');
      },
    });
  }

  /**
   * Exibe uma mensagem de toast.
   */
  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}
