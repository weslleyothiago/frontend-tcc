import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DefaultAuthService } from 'src/app/services/default-auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  activeTemplate: string = 'forgotPasswordScreen';
  forgotPasswordForm!: FormGroup;
  errorMessage: string = '';  
  successMessage: string = '';

  @ViewChild('forgotPasswordScreen') forgotPasswordScreen!: TemplateRef<any>;
  @ViewChild('resetPasswordSuccessScreen') resetPasswordSuccessScreen!: TemplateRef<any>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public router: Router,
    private formBuilder: FormBuilder,
    public defaultAuthService: DefaultAuthService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.(com|net|org|edu|gov|mil)$')]],
    });
  }

  async resetPassword() {
    const email = this.forgotPasswordForm.get('email')?.value;

    if (!email) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    try {
      await this.defaultAuthService.resetPassword(email);
      this.successMessage = 'Password reset link sent successfully.';
      console.log('Password reset link sent.');

      this.activateTemplate('resetPasswordSuccessScreen');

    } catch (error) {
      console.error('Error sending reset password link: ', error);
      this.errorMessage = 'An error occurred while sending the reset password link. Please try again.';
    }
  }

  activateTemplate(template: string) {
    this.activeTemplate = template;
    this.changeDetectorRef.detectChanges();
  }

  getTemplate() {
    switch (this.activeTemplate) {
      case 'forgotPasswordScreen':
        return this.forgotPasswordScreen;
      case 'resetPasswordSuccessScreen':
        return this.resetPasswordSuccessScreen;
      default:
        return this.forgotPasswordScreen;
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
