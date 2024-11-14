import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PainelAdminPageRoutingModule } from './painel-admin-routing.module';

import { PainelAdminPage } from './painel-admin.page';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    PainelAdminPageRoutingModule
  ],
  declarations: [PainelAdminPage]
})
export class PainelAdminPageModule {}
