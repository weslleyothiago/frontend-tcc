import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { GoogleAuthService } from 'src/app/services/google-auth.service';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  registrationForm!: FormGroup;
  activeTemplate: string = 'emailScreen';

  @ViewChild('emailScreen') emailScreen!: TemplateRef<any>;
  @ViewChild('passwordScreen') passwordScreen!: TemplateRef<any>;
  @ViewChild('nameAndDobScreen') nameAndBirthScreen!: TemplateRef<any>;

  days: number[] = [];
  months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];
  years: number[] = [];

  constructor(
    private googleAuthService: GoogleAuthService,
    public router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private registerService: RegisterService,
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

    // Populating the list of years (from 1900 to the current year)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
      this.years.push(i);
    }

    // Initialize the days based on the selected month and year
    this.updateDays();
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
      message: 'Registering...',
      spinner: 'crescent',
    });
    await loading.present();
  
    if (this.registrationForm?.valid) {
      const email = this.registrationForm.get('email')?.value;
      const password = this.registrationForm.get('password')?.value;

      // Dados para envio ao backend
      const userData = {
        email: email,
        senha: password,
        tipo: 'Cliente'  // Tipo fixo como "Cliente"
      };
  
      // Chamando o serviço de autenticação com subscribe
      this.registerService.register(userData).subscribe(
        response => {
          console.log('User registered successfully: ', response);
          this.router.navigate(['/home']);
          this.modalController.dismiss();  // Fechando o modal de cadastro, se aplicável
        },
        error => {
          console.log(JSON.stringify(userData));
          console.error('Error registering user: ', error);
        },
        () => {
          loading.dismiss();  // Sempre fechando o spinner de carregamento, independentemente do sucesso ou falha
        }
      );
  
    } else {
      await loading.dismiss();
      console.error('Invalid form data'); // Exibir ou lidar com o erro conforme necessário
    }
  }


  // Method to register with Google
  async registerWithGoogle() {
    try {
      await this.googleAuthService.registerUserWithGoogle();
      // Here you can redirect the user or show a success message
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
