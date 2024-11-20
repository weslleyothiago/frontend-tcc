import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ForgotPasswordComponent } from 'src/app/components/forgot-password/forgot-password.component';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { GoogleAuthService } from 'src/app/services/google-auth.service';
import { AuthService } from 'src/app/services/auth.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',  
  styleUrls: ['./login.page.scss'],  
})
export class LoginPage implements OnInit {  
  loginForm!: FormGroup;  
  errorMessage: string = '';
  
  constructor(
    public router: Router,
    private authService: AuthService,
    public googleAuthService: GoogleAuthService,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [
        '', 
        [
          Validators.required, 
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.(com|net|org|edu|gov|mil)$')
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d).{8,}$")
        ]
      ],
    });
  }

  get controlErrors() {
    return this.loginForm?.controls;
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Logando...',
      spinner: 'crescent',
    });
    await loading.present();
  
    this.loginForm.markAllAsTouched();
  
    if (this.loginForm?.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
  
      try {
        const response = await this.authService.login(email, password).toPromise();
        console.log('Response object:', response);
  
        if (response.access_token) {
          console.log('Access token to store:', response.access_token);
          sessionStorage.setItem('access_token', response.access_token);
        } else {
          console.error('Access token not found in response');
        }
  
        this.router.navigate(['/home']);
        this.modalController.dismiss();
      } catch (error) {
        console.error('Error logging in user:', error);
        this.errorMessage = 'E-mail ou senha incorretos.';
      } finally {
        await loading.dismiss();
      }
    } else {
      await loading.dismiss();
      this.errorMessage = 'Por favor preencha o formulário corretamente.';
    }
  }
  
  

  async openRegisterModal() {
    const modal = await this.modalController.create({
      component: RegisterComponent,
      cssClass: 'backdrop-blur-3xl',
    });
    return await modal.present();
  }

  async openForgotPasswordModal() {  
    const modal = await this.modalController.create({
      component: ForgotPasswordComponent, 
      cssClass: 'backdrop-blur-3xl',
    });
    return await modal.present();
  }

  async loginWithGoogle() { 
    try {
      await this.googleAuthService.loginWithGoogle(); 
      this.router.navigate(['/home']);
    } catch (error) {
      this.errorMessage = 'Erro ao tentar fazer login no Google.';
    }
  }

  loginWithGoogleRedirect() {
    window.location.href = 'http://localhost:3000/auth/google';
  }
}
