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

  get controlErrors() {  // Changed from 'controlErros' to 'controlErrors'
    return this.loginForm?.controls;
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
      spinner: 'crescent',
    });
    await loading.present();
  
    this.loginForm.markAllAsTouched();
  
    if (this.loginForm?.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
  
      try {
        this.authService.login(email, password).subscribe(
          (response) => {
            console.log('User logged in successfully: ', response);
            // Supondo que a resposta tenha a propriedade 'token'
            sessionStorage.setItem('access_token', response.token);
  
            this.router.navigate(['/home']);
            this.modalController.dismiss();
          },
          (error) => {
            console.error('Error logging in user: ', error);
            this.errorMessage = 'Incorrect email or password.';
          }
        );
      } finally {
        await loading.dismiss();
      }
    } else {
      await loading.dismiss();
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
  

  // Function to open the register modal
  async openRegisterModal() {  // Changed from 'abreModalRegistrar' to 'openRegisterModal'
    const modal = await this.modalController.create({
      component: RegisterComponent,  // Changed from 'RegisterModalComponent' to 'RegisterComponent'
      cssClass: 'backdrop-blur-3xl',
    });
    return await modal.present();
  }

  // Function to open the forgot password modal
  async openForgotPasswordModal() {  // Changed from 'abreModalEsqueciSenha' to 'openForgotPasswordModal'
    const modal = await this.modalController.create({
      component: ForgotPasswordComponent,  // Changed from 'EsqueciSenhaComponent' to 'ForgotPasswordComponent'
      cssClass: 'backdrop-blur-3xl',
    });
    return await modal.present();
  }

  // Method to login with Google
  async loginWithGoogle() {  // Changed from 'logarComGoogle' to 'loginWithGoogle'
    try {
      await this.googleAuthService.loginWithGoogle();  // Changed from 'fazerLoginComGoogle' to 'loginWithGoogle'
      this.router.navigate(['/home']);
    } catch (error) {
      this.errorMessage = 'Error trying to log in with Google.';
    }
  }

  loginWithGoogleRedirect() {  // Changed from 'loginWithGoogle' to 'loginWithGoogleRedirect'
    window.location.href = 'http://localhost:3333/auth/google';
  }
}
