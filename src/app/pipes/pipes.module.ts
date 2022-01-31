import { FiltroPipe } from './filtro.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    FiltroPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FiltroPipe
  ]
})
export class PipesModule { }
