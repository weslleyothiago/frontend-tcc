import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-playlist-create',
  templateUrl: './playlist-create.component.html',
  styleUrls: ['./playlist-create.component.scss'],
})
export class PlaylistCreateComponent  implements OnInit {

  previewImage: string | null = null; // Para armazenar o caminho da imagem carregada
  playlistForm!: FormGroup;
  
  constructor(
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
}
