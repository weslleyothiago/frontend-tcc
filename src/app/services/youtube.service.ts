import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {

  constructor(private http: HttpClient) {}

  getVideoDetails(videoId: string) {
    const params = new HttpParams()
      .set('id', videoId)
      .set('part', 'contentDetails')
      .set('key', environment.apiYoutubeKey);

    return this.http.get(environment.apiYoutubeUrl, { params, headers: { 'Skip-Interceptor': 'true' } });
  }

  extractVideoId(url: string): string | null {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    return videoIdMatch ? videoIdMatch[1] : null;
  }
}
