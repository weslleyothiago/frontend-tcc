import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  checkName(name: string): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/user/check-name/?name=${name}`);
  }
  
}

