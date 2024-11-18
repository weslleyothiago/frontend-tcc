import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MusicService } from 'src/app/services/music.service';
import { YoutubeService } from 'src/app/services/youtube.service';
import { Music } from '../../models/music.model';
import { LoadingController } from '@ionic/angular';
import { ArtistService } from 'src/app/services/artist.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-music-registration',
  templateUrl: './music-registration.page.html',
  styleUrls: ['./music-registration.page.scss'],
})
export class MusicRegistrationPage implements OnInit {

  musicForm!: FormGroup;
  videoDuration: string | null = null;
  musicPreview: { title: string; artist: string; thumbnail: string } | null = null;
  artistSuggestions: { id: number; nome: string }[] = []; // Sugestões de artistas
  artistSelected = false;
  artistNotFound: boolean = false;
  missingArtistName: string = '';
  isPreviewUpdated: boolean = false;
  messageErrorSucess: string | null = null;
  isSuccessMessage: boolean = false;


  music: Music = {
    title: '',
    link: '',
    artist: '',
    duration: '',
    slug: '',
    genreId: 0,
  };

  generosMusicais = [
    { genero: 'K-pop', value: 1 },
    { genero: 'Pop', value: 2 },
    { genero: 'Rock', value: 3 },
    { genero: 'Sertanejo', value: 4 },
    { genero: 'Funk', value: 5 },
    { genero: 'Eletrônica', value: 6 },
    { genero: 'Samba', value: 7 },
    { genero: 'Forró', value: 8 },
    { genero: 'Gospel', value: 9 },
    { genero: 'Rap', value: 10 },
    { genero: 'Reggae', value: 11 },
    { genero: 'MPB', value: 12 },
    { genero: 'Metal', value: 13 },
    { genero: 'Indie', value: 14 },
    { genero: 'Alternativo', value: 15 },
  ];

  constructor(
    public loadingCtrl: LoadingController,
    private youtubeService: YoutubeService,
    private musicService: MusicService,
    private artistService: ArtistService,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.musicForm = this.formBuilder.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      link: ['', [Validators.required, Validators.pattern('https?://(www\.youtube\.com|youtu\.be)/.+')]],
      genre: ['', Validators.required],
    });

    // Atualiza o slug ao alterar o título ou o artista
    this.musicForm.get('title')?.valueChanges.subscribe(() => this.updateSlug());
    this.musicForm.get('artist')?.valueChanges.subscribe(() => this.updateSlug());

    // Busca sugestões de artistas enquanto o usuário digita
    this.musicForm.get('artist')?.valueChanges.subscribe(value => {
      if (value && value.length > 2) {
        this.searchArtists(value);
      } else {
        this.artistSuggestions = [];
      }
    });

    this.musicForm.valueChanges.subscribe(() => {
      this.isPreviewUpdated = false;
    });
  }

  updateSlug() {
    const title = this.musicForm.get('title')?.value || '';
    const artist = this.musicForm.get('artist')?.value || '';
    this.music.slug = this.generateSlug(`${title}`);
  }

  formatDuration(duration: string): string {
    const parts = duration.replace('PT', '').split(/H|M|S/);
    const hours = parts[2] ? parts[2].padStart(2, '0') : '00';
    const minutes = parts[0] ? parts[0].padStart(2, '0') : '00';
    const seconds = parts[1] ? parts[1].padStart(2, '0') : '00';

    return hours === '00' ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
  }

  // Método para buscar artistas
  searchArtists(query: string) {
    this.artistService.searchArtists(query).subscribe((artists) => {
      this.artistSuggestions = artists;
    });
  }

  async presentArtistNotFoundAlert(artistName: string) {
    const alert = await this.alertCtrl.create({
      header: 'Artista Não Encontrado',
      message: `O artista <strong>${artistName}</strong> não existe no banco de dados. Deseja registrá-lo?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'btn-cancel', 
          handler: () => {
            this.cancelArtistRegistration();
          },
        },
        {
          text: 'Registrar',
          cssClass: 'btn-register',
          handler: () => {
            this.registerNewArtist(artistName);
          },
        },
      ],
      cssClass: 'alert-custom backdrop-blur-3xl',
    });
  
    await alert.present();
  }
  
  
  generatePreview() {
    this.musicPreview;
    this.isPreviewUpdated = true;
    this.cdr.detectChanges();
  }

  // Método para atualizar a prévia
  updatePreview() {
    this.isPreviewUpdated = false;
    this.generatePreview();
  }

  // Método de envio do formulário
  onSubmit() {
    if (this.musicForm.valid && !this.isPreviewUpdated) {
      this.updatePreview();
    }
    const artistName = this.musicForm.get('artist')?.value;
  
    // Verifica se o artista existe entre as sugestões
    const artistExists = this.artistSuggestions.some(artist => artist.nome === artistName);
  
    if (!artistExists) {
      this.presentArtistNotFoundAlert(artistName);
    } else {
      const videoUrl = this.musicForm.get('link')?.value;
      const videoId = this.youtubeService.extractVideoId(videoUrl);
  
      if (videoId) {
        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  
        this.youtubeService.getVideoDetails(videoId).subscribe((response: any) => {
          const duration = response.items[0]?.contentDetails?.duration || '';
          this.videoDuration = this.formatDuration(duration);
  
          this.musicPreview = {
            title: this.musicForm.get('title')?.value,
            artist: this.musicForm.get('artist')?.value,
            thumbnail: thumbnail,
          };
  
          // Atualiza os dados da música
          this.music.title = this.musicForm.get('title')?.value;
          this.music.artist = this.musicForm.get('artist')?.value;
          this.music.link = this.musicForm.get('link')?.value;
          this.music.genreId = this.musicForm.get('genre')?.value;
          this.music.duration = this.videoDuration || '';
        });
      } else {
        console.error('Video ID not found');
      }
    }
  }
  
    cancelArtistRegistration() {
      this.artistNotFound = false;
      this.musicForm.get('artist')?.setValue('');
    }
  
    // Lógica para registrar um novo artista
    async registerNewArtist(artistName: string) {
      const loading = await this.loadingCtrl.create({
        message: 'Registrando...',
        spinner: 'crescent',
      });
      await loading.present();
    
      // Chama o serviço para registrar o artista
      this.artistService.create({ nome: artistName }).subscribe({
        next: (response) => {
          console.log('Artista registrado com sucesso!', response);
          this.musicPreview = null; 
          this.musicForm.reset();
          this.artistNotFound = false;
        },
        error: (error) => {
          console.error('Erro ao registrar artista: ', error);
        },
        complete: async () => {
          await loading.dismiss();
        }
      });
    }
    
  
    async registerMusic() {
      const loading = await this.loadingCtrl.create({
        message: 'Registrando...',
        spinner: 'crescent',
      });
      await loading.present();
    
      try {
        this.musicService.create(this.music).subscribe({
          next: (response) => {
            // Mensagem de sucesso
            this.messageErrorSucess = 'Música registrada com sucesso!';
            this.isSuccessMessage = true;
    
            // Obtém o ID do artista e da música para criar a relação
            const artistId = this.artistSuggestions.find(
              (artist) => artist.nome === this.music.artist
            )?.id;
    
            if (artistId && response.id) {
              // Chama o método para criar a relação entre a música e o artista
              this.musicService.createMusicArtistRelation(response.id, artistId).subscribe({
                next: (relationResponse) => {
                  console.log('Relação música-artista criada com sucesso:', relationResponse);
                },
                error: (error) => {
                  console.error('Erro ao criar a relação música-artista:', error);
                },
              });
            } else {
              console.log(`Artist:${artistId} Response:${response.id}`)
              console.error('Não foi possível encontrar o ID do artista ou da música');
            }
    
            // Limpa a pré-visualização e o formulário
            this.musicPreview = null;
            this.musicForm.reset();
            this.musicForm.get('artist')?.enable();
    
            // Limpa a mensagem após um tempo
            this.clearMessageAfterDelay();
          },
          error: async (error) => {
            this.messageErrorSucess = 'Erro ao registrar música. Tente novamente.';
            this.isSuccessMessage = false;
            this.clearMessageAfterDelay();
            console.error('Erro ao registrar música: ', error);
            await loading.dismiss();
          },
          complete: async () => {
            await loading.dismiss();
          },
        });
      } catch (error) {
        this.messageErrorSucess = 'Erro ao registrar música. Tente novamente.';
        this.isSuccessMessage = false;
        this.clearMessageAfterDelay();
        console.error('Erro ao registrar música: ', error);
        await loading.dismiss();
      }
    }
    
    
    clearMessageAfterDelay() {
      setTimeout(() => {
        this.messageErrorSucess = null;
      }, 5000);
    }

  selectArtist(artist: any) {
    this.musicForm.get('artist')?.setValue(artist.nome);
    this.artistSelected = true;
    this.musicForm.get('artist')?.disable();
  }

  clearArtistSelection() {
    this.musicForm.get('artist')?.setValue('');
    this.artistSelected = false;
    this.musicForm.get('artist')?.enable();
  }

  generateSlug(text: string): string {
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }
}
