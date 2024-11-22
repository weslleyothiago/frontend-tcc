import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-music-card',
  templateUrl: './music-card.component.html',
  styleUrls: ['./music-card.component.scss']
})
export class MusicCardComponent {
  @Input() title: string = '';
  @Input() artist: string = '';
  @Input() videoUrl: string = '';
  @Input() thumbnail: string = '';
  @Input() showThumbnail: boolean = false;
}
