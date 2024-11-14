import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PainelAdminPage } from './painel-admin.page';

const routes: Routes = [
  {
    path: '',
    component: PainelAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PainelAdminPageRoutingModule {}
