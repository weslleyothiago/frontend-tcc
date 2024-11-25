import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist-musics',
  templateUrl: './playlist-musics.component.html',
  styleUrls: ['./playlist-musics.component.scss'],
})
export class PlaylistMusicsComponent implements OnInit {
  @Input() playlist: any; // Recebendo a playlist selecionada

  randomGradient: string = '';

  ngOnInit() {
    this.randomGradient = this.generateRandomGradient();
  }

  private generateRandomGradient(): string {
    const randomColor = this.getRandomColor();
    return `linear-gradient(to right, ${randomColor}, black)`;
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
