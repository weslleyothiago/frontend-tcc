import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {

  constructor(private http: HttpClient) {}

  getVideoDetails(videoId: string) {
    return this.http.get(`${environment.apiBaseUrl}/youtube/video-details`, {
      params: { videoId },
    });
  }

  extractVideoId(url: string): string | null {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    return videoIdMatch ? videoIdMatch[1] : null;
  }
}
