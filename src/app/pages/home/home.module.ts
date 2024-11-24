import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { MusicCardComponent } from 'src/app/components/music-card/music-card.component';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { PlaylistCreateComponent } from 'src/app/components/playlist-create/playlist-create.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, MusicCardComponent, SafeUrlPipe, PlaylistCreateComponent],
  exports: [MusicCardComponent, SafeUrlPipe]
})
export class HomePageModule {}
