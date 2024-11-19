import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { DashBoardAdminComponent } from 'src/app/components/dashboard-admin/dashboard-admin.component';
import { AdminSearchFilterPipe } from 'src/app/pipes/admin-search-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule
  ],
  declarations: [AdminPage, DashBoardAdminComponent, AdminSearchFilterPipe],
  providers: [DatePipe]
})
export class AdminPageModule {}
