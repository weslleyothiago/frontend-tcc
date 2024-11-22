import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { MusicCardComponent } from 'src/app/components/music-card/music-card.component';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, MusicCardComponent, SafeUrlPipe],
  exports: [MusicCardComponent, SafeUrlPipe]
})
export class HomePageModule {}
