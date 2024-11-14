import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicRegistrationPageRoutingModule } from './music-registration-routing.module';

import { MusicRegistrationPage } from './music-registration.page';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    MusicRegistrationPageRoutingModule
  ],
  declarations: [MusicRegistrationPage]
})
export class MusicRegistrationPageModule {}
