import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { GoogleAuthService } from 'src/app/services/google-auth.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  @Input() userType: string = 'Cliente';
  @Input() routerNavigate: string = '/home';

  registrationForm!: FormGroup;
  activeTemplate: string = 'emailScreen';
  emailExists: boolean = false;
  nameExists: boolean = false;

  @ViewChild('emailScreen') emailScreen!: TemplateRef<any>;
  @ViewChild('passwordScreen') passwordScreen!: TemplateRef<any>;
  @ViewChild('nameAndDobScreen') nameAndBirthScreen!: TemplateRef<any>;

  days: number[] = [];
  months = [
    { name: 'Janeiro', value: 1 },
    { name: 'Fevereiro', value: 2 },
    { name: 'Março', value: 3 },
    { name: 'Abril', value: 4 },
    { name: 'Maio', value: 5 },
    { name: 'Junho', value: 6 },
    { name: 'Julho', value: 7 },
    { name: 'Agosto', value: 8 },
    { name: 'Setembro', value: 9 },
    { name: 'Outubro', value: 10 },
    { name: 'Novembro', value: 11 },
    { name: 'Dezembro', value: 12 },
  ];
  years: number[] = [];

  constructor(
    private googleAuthService: GoogleAuthService,
    public router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private profileService: ProfileService,
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
  ) {}


  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.(com|net|org|edu|gov|mil)$')]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d).{8,}$")]],
      name: ['', Validators.required],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
    });

    // Preenchendo a lista de anos (de 1900 até o ano atual)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
      this.years.push(i);
    }

    this.updateDays();
  }

  checkNomeAvailability() {
    const name = this.registrationForm.get('name')?.value;
    console.log('Verificando nome:', name);
    if (name) {
      this.profileService.checkName(name).subscribe((response) => {
        this.nameExists = response.nameExists;
        console.log('checkEmailAvailability:', response);
      });
    }
  }

  checkEmailAvailability() {
    const email = this.registrationForm.get('email')?.value;
    console.log('Verificando email:', email);
    if (email) {
      this.authService.checkEmail(email).subscribe((response) => {
        this.emailExists = response.emailExists;
        console.log('checkEmailAvailability:', response);
      });
    }
  }
  
  get controlErrors() {
    return this.registrationForm?.controls;
  }  

  get passwordValid() {
    const password = this.registrationForm.controls['password'].value || '';
    
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const minLength = password.length >= 8;
  
    return {
      hasLetter,
      hasNumber,
      minLength
    };
  }

  async register() {
    const loading = await this.loadingCtrl.create({
      message: 'Registrando...',
      spinner: 'crescent',
    });
    await loading.present();
  
    if (this.registrationForm?.valid) {
      const email = this.registrationForm.get('email')?.value;
      const password = this.registrationForm.get('password')?.value;

      const day = this.registrationForm.get('day')?.value;
      const month = this.registrationForm.get('month')?.value;
      const year = this.registrationForm.get('year')?.value;

      let formattedDate = null;
      if (day && month && year) {
        formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }

      const userData = {
        email: email,
        senha: password,
        tipo: this.userType,
      };
    
      const profileData = {
        nome: this.registrationForm.get('name')?.value,
        dataNascimento: formattedDate,
      };
    
      // Envia os dados do usuário e perfil para o backend em uma única requisição
      this.authService.register(userData, profileData).subscribe(
        response => {
          console.log('User and profile registered successfully: ', response);
          this.router.navigate([this.routerNavigate]);
          this.modalController.dismiss();
        },
        error => {
          console.log('Error registering user and profile: ', error);
        },
        () => {
          loading.dismiss();
        }
      );      
    } else {
      await loading.dismiss();
      console.error('Invalid form data');
    }
  }  


  // Method to register with Google
  async registerWithGoogle() {
    try {
      await this.googleAuthService.registerUserWithGoogle();
    } catch (error) {
      console.log('Error registering with Google: ' + error);
    }
  }
  

  closeModal() {
    this.modalController.dismiss();
  }

  activateTemplate(template: string) {
    this.activeTemplate = template;
    this.changeDetectorRef.detectChanges();
  }

  getTemplate() {
    switch (this.activeTemplate) {
      case 'emailScreen':
        return this.emailScreen;
      case 'passwordScreen':
        return this.passwordScreen;
      case 'nameAndDobScreen':
        return this.nameAndBirthScreen;
      default:
        return this.emailScreen;
    }
  }

  changeDate() {
    this.updateDays();
  }

  updateDays() {
    const month = this.registrationForm.get('month')?.value;
    const year = this.registrationForm.get('year')?.value;

    if (month && year) {
      const daysInMonth = this.getDaysInMonth(month, year);
      this.days = Array.from({ length: daysInMonth }, (v, k) => k + 1);
    }
  }

  getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }
}
