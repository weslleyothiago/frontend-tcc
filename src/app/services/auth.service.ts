import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(userData: { email: string; senha: string; tipo: string; }, profileData: any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/user`, { 
      createUserDto: userData,  // Dados do usuário
      createProfileDto: profileData  // Dados do perfil
    });
  }

    login(email: string, password: string): Observable<any> {
      return this.http.post(`${environment.apiBaseUrl}/login`, { email, password });
    }
  
    checkEmail(email: string): Observable<any> {
      return this.http.get(`${environment.apiBaseUrl}/check-email/?email=${email}`);
    }
}
