import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterMusicPage } from './register-music.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterMusicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterMusicPageRoutingModule {}
