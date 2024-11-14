import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterMusicPageRoutingModule } from './register-music-routing.module';

import { RegisterMusicPage } from './register-music.page';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterMusicPageRoutingModule
  ],
  declarations: [RegisterMusicPage]
})
export class RegisterMusicPageModule {}
