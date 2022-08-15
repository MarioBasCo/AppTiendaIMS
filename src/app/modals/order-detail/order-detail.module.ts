import { OrderDetailComponent } from './order-detail.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';



@NgModule({
  declarations: [OrderDetailComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  providers: [DatePipe],
  exports: [OrderDetailComponent]
})
export class OrderDetailModule { }
