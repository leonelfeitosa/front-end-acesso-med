import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { NguiMapModule} from '@ngui/map';

import { MedicoLayoutRoutes } from './medico-layout.routing';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModuleModule } from '../../shared/shared-module/shared-module.module';

import { ComprasComponent } from '../../pages/compras/compras.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MedicoLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=YOUR_KEY_HERE'}),
    SweetAlert2Module.forRoot(),
    SharedModuleModule,
    TagInputModule,
  ],
  declarations: [
    ComprasComponent
  ]
})

export class MedicoLayoutModule {}
