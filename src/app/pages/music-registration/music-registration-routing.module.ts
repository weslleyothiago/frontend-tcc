import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusicRegistrationPage } from './music-registration.page';

const routes: Routes = [
  {
    path: '',
    component: MusicRegistrationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicRegistrationPageRoutingModule {}
