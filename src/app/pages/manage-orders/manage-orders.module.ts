import { OrderDetailModule } from './../../modals/order-detail/order-detail.module';
import { HeaderModule } from './../../components/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageOrdersPageRoutingModule } from './manage-orders-routing.module';

import { ManageOrdersPage } from './manage-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    OrderDetailModule,
    ManageOrdersPageRoutingModule
  ],
  declarations: [ManageOrdersPage]
})
export class ManageOrdersPageModule {}
