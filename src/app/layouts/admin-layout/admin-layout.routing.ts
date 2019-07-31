import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { CadastrarAgenteComponent } from '../../cadastrar-agente/cadastrar-agente.component';
import { ClinicasComponent } from '../../clinicas/clinicas.component';
import { CadastrarClinicaComponent } from '../../cadastrar-clinica/cadastrar-clinica.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'admin/agentes',      component: HomeComponent },
    { path: 'admin/agentes/adicionar', component: CadastrarAgenteComponent},
    { path: 'admin/agentes/editar/:id', component: CadastrarAgenteComponent, data: {edit: true}},
    { path: 'admin/clinicas', component: ClinicasComponent},
    { path: 'admin/clinicas/adicionar', component: CadastrarClinicaComponent},
    { path: 'admin/clinicas/editar/:id', component: CadastrarClinicaComponent, data: {edit: true}}
    
];
