import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MusicService } from '../../services/music.service';
import { YoutubeService } from 'src/app/services/youtube.service';
import { Music } from '../../models/music.model';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register-music',
  templateUrl: './register-music.page.html',
  styleUrls: ['./register-music.page.scss'],
})
export class RegisterMusicPage implements OnInit {
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

  musicalGenres = [
    { genre: 'K-pop', value: 1 },
    { genre: 'Pop', value: 2 },
    { genre: 'Rock', value: 3 },
    { genre: 'Country', value: 4 },
    { genre: 'Funk', value: 5 },
    { genre: 'Electronic', value: 6 },
    { genre: 'Samba', value: 7 },
    { genre: 'Forró', value: 8 },
    { genre: 'Gospel', value: 9 },
    { genre: 'Rap', value: 10 },
    { genre: 'Reggae', value: 11 },
    { genre: 'MPB', value: 12 },
    { genre: 'Metal', value: 13 },
    { genre: 'Indie', value: 14 },
    { genre: 'Alternative', value: 15 },
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
    // Remove 'PT' prefix and split the string based on hours, minutes, and seconds
    const parts = duration.replace('PT', '').split(/H|M|S/);

    // Get hours, minutes, and seconds
    const hours = parts[2] ? parts[2].padStart(2, '0') : '00';
    const minutes = parts[0] ? parts[0].padStart(2, '0') : '00';
    const seconds = parts[1] ? parts[1].padStart(2, '0') : '00';

    // If no hours, format as MM:SS
    if (hours === '00') {
        return `${minutes}:${seconds}`;
    }

    // If hours present, format as HH:MM:SS
    return `${hours}:${minutes}:${seconds}`;
  }

  onSubmit() {
    const videoUrl = this.musicForm.get('link')?.value;
    const videoId = this.youtubeService.extractVideoId(videoUrl);
  
    if (videoId) {
      const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  
      // Get video duration
      this.youtubeService.getVideoDuration(videoId).subscribe({
        next: (response: any) => {
          const duration = response.items[0]?.contentDetails?.duration || '';
  
          // Convert the duration to a readable format
          this.videoDuration = this.formatDuration(duration);
  
          // Prepare the music preview
          this.musicPreview = {
            title: this.musicForm.get('title')?.value,
            artist: this.musicForm.get('artist')?.value,
            thumbnail: thumbnail,
          };
  
          // Update music data
          this.music.title = this.musicForm.get('title')?.value;
          this.music.artist = this.musicForm.get('artist')?.value;
          this.music.link = this.musicForm.get('link')?.value;
          this.music.genreId = this.musicForm.get('genre')?.value;
          this.music.duration = this.videoDuration || '';
        },
        error: (error) => {
          console.error('Error fetching video duration:', error);
        }
      });
    } else {
      console.error('Video ID not found');
    }
  }  

  async registerMusic() {
    const loading = await this.loadingCtrl.create({
      message: 'Registering...',
      spinner: 'crescent',
    });
    await loading.present();
  
    try {
      // Send to the backend and await response
      this.musicService.create(this.music).subscribe({
        next: (response) => {
          console.log('Music registered!', response);
  
          // Only reset if the response is successful
          this.musicPreview = null;
          this.musicForm.reset();
        },
        error: (error) => {
          console.error('Error registering music: ', error);
        },
        complete: async () => {
          await loading.dismiss();
        }
      });
    } catch (error) {
      console.error('Error registering music: ', error);
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
