import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  isAdmin: boolean = false

  constructor() {
    this.checkUserType();
   }

   checkUserType(){
    const token = sessionStorage.getItem('access_token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.isAdmin = decodedToken.type === 'Administrador';
    }
    console.log(this.isAdmin);
   }
}
