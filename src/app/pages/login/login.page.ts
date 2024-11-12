import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ForgotPasswordComponent } from 'src/app/components/forgot-password/forgot-password.component';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { GoogleAuthService } from 'src/app/services/google-auth.service';
import { DefaultAuthService } from 'src/app/services/default-auth.service';

@Component({
  selector: 'app-login',  // Changed from 'login-page' to 'login'
  templateUrl: './login.page.html',  // Changed from 'login-page.page.html' to 'login.page.html'
  styleUrls: ['./login.page.scss'],  // Changed from 'login-page.page.scss' to 'login.page.scss'
})
export class LoginPage implements OnInit {  // Changed from 'LoginPagePage' to 'LoginPage'
  loginForm!: FormGroup;  // Changed from 'formularioLogar' to 'loginForm'
  errorMessage: string = '';  // Changed from 'mensagemErro' to 'errorMessage'
  
  constructor(
    public router: Router,
    public googleAuthService: GoogleAuthService,  // Changed from 'authServiceGoogle' to 'googleAuthService'
    public defaultAuthService: DefaultAuthService,  // Changed from 'authService' to 'emailAuthService'
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

  async login() {  // Changed from 'logarSe' to 'login'
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
        // Calling the authentication service to log the user in
        const user = await this.defaultAuthService.loginUser(email, password);  // Changed from 'logarUsuario' to 'loginUser'
        console.log('User logged in successfully: ', user);
  
        // Redirect to the homepage after successful login
        this.router.navigate(['/home']);
        this.modalController.dismiss();  // Close the register modal (if applicable)
  
      } catch (error) {
        console.error('Error logging in user: ', error);
        
        // Display error message
        this.errorMessage = 'Incorrect email or password.';
  
      } finally {
        await loading.dismiss();  // Always close the loading, regardless of success or error
      }
  
    } else {
      // If the form is invalid, close the loading and display an error message
      await loading.dismiss();
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
