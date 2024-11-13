import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(userData: { email: string; senha: string; tipo: string}): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/user`, userData);
  }

    login(email: string, password: string): Observable<any> {
      return this.http.post(`${environment.apiBaseUrl}/login`, { email, password });
    }
  
}
