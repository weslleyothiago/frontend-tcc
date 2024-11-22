import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode'; // Certifique-se de instalar esta biblioteca: npm install jwt-decode

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('access_token');

    // Verifique se o token existe
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      // Decodifica o token para obter as informações do usuário
      const decodedToken: any = jwtDecode(token);

      // Verifica se o tipo de conta é "Administrador"
      if (decodedToken.type !== 'Administrador') {
        this.router.navigate(['/login']); // Redireciona para uma página de acesso negado
        return false;
      }

      return true; // Permite acesso para Administradores
    } catch (error) {
      console.error('Token inválido ou malformado:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
