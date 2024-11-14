import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MusicService } from './music.service';
import { YoutubeService } from 'src/app/services/youtube.service';
import { Music } from './music.model';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-painel-admin',
  templateUrl: './painel-admin.page.html',
  styleUrls: ['./painel-admin.page.scss'],
})
export class PainelAdminPage implements OnInit {
  genres: string[] = [];
  filteredGenres: string[] = [];
  searchGenre: string = '';

  musicForm!: FormGroup;
  videoDuration: string | null = null;
  musicPreview: { title: string; artist: string; thumbnail: string } | null = null;

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
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.musicService.getGenres().subscribe((genres) => {
      this.genres = genres;
      this.filteredGenres = [...genres];
    });

    this.musicForm = this.formBuilder.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      link: ['', [Validators.required, Validators.pattern('https?://(www\.youtube\.com|youtu\.be)/.+')]],
      genre: ['', Validators.required],
    });

    this.musicForm.get('title')?.valueChanges.subscribe(() => this.updateSlug());
    this.musicForm.get('artist')?.valueChanges.subscribe(() => this.updateSlug());
  }

  filterGenres(event: any) {
    const searchGenre = event.target.value.toLowerCase();
    this.filteredGenres = this.genres.filter((genre) => genre.toLowerCase().includes(searchGenre));
  }

  updateSlug() {
    const title = this.musicForm.get('title')?.value || '';
    this.music.slug = this.generateSlug(title);
  }

  formatDuration(duration: string): string {
    // Remove o prefixo 'PT' e divide a string com base nas partes de horas, minutos e segundos
    const parts = duration.replace('PT', '').split(/H|M|S/);

    // Obtemos horas, minutos e segundos
    const hours = parts[2] ? parts[2].padStart(2, '0') : '00';
    const minutes = parts[0] ? parts[0].padStart(2, '0') : '00';
    const seconds = parts[1] ? parts[1].padStart(2, '0') : '00';

    // Se não houver horas, formate como MM:SS
    if (hours === '00') {
        return `${hours}:${minutes}:${seconds}`; // Retorna apenas MM:SS
    }

    // Se houver horas, formate como HH:MM:SS
    return `${hours}:${minutes}:${seconds}`;
}


  onSubmit() {
    const videoUrl = this.musicForm.get('link')?.value;
    const videoId = this.youtubeService.extractVideoId(videoUrl);

    if (videoId) {
      const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      // Obtenha a duração do vídeo
      this.youtubeService.getVideoDuration(videoId).subscribe((response: any) => {
        const duration = response.items[0]?.contentDetails?.duration || ''; // Obtenha a duração

        // Converte a duração para um formato legível
        this.videoDuration = this.formatDuration(duration);

        // Prepara a prévia da música
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

  async registerMusic() {
    const loading = await this.loadingCtrl.create({
      message: 'Registrando...',
      spinner: 'crescent',
    });
    await loading.present();
  
    try {
      // Envia para o backend e aguarda a resposta
      this.musicService.create(this.music).subscribe({
        next: (response) => {
          console.log('Music registered!', response);
  
          // Somente reseta se a resposta for um sucesso
          this.musicPreview = null;
          this.musicForm.reset();
        },
        error: (error) => {
          console.error('Erro ao registrar música: ', error);
        },
        complete: async () => {
          await loading.dismiss();
        }
      });
    } catch (error) {
      console.error('Erro ao registrar música: ', error);
      await loading.dismiss();
    }
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