import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule
  ],
  declarations: [],
  exports: [NgxSpinnerModule]
})
export class SharedModuleModule { }
