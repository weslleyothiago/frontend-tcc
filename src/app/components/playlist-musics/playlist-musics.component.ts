import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist-musics',
  templateUrl: './playlist-musics.component.html',
  styleUrls: ['./playlist-musics.component.scss'],
})
export class PlaylistMusicsComponent implements OnInit {
  @Input() playlist: any; // Recebendo a playlist selecionada
  @Input() randomGradient: string = '';

  ngOnInit() {

  }


}
