import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiKey = 'AIzaSyDEaBpGOb1n0PzI_N6iyGyETkbuAqKuoTw';

  constructor(private http: HttpClient) {}


  getVideoDuration(videoId: string): Observable<any> {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${this.apiKey}`;

    return this.http.get(url).pipe(
      tap((response: any) => {
        console.log('API Response:', response);
      }),
      catchError((error) => {
        console.error('Error during API call:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          errorDetails: error.error,
        });
        return throwError(error);
      })
    );
  }
  

  extractVideoId(url: string): string | null {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    return videoIdMatch ? videoIdMatch[1] : null;
  }
}
