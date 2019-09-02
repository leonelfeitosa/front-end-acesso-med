import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { CadastrarAgenteComponent } from '../../cadastrar-agente/cadastrar-agente.component';
import { ClinicasComponent } from '../../clinicas/clinicas.component';
import { CadastrarClinicaComponent } from '../../cadastrar-clinica/cadastrar-clinica.component';
import { ClientesComponent } from '../../clientes/clientes.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'agentes',      component: HomeComponent },
    { path: 'agentes/adicionar', component: CadastrarAgenteComponent},
    { path: 'agentes/editar/:id', component: CadastrarAgenteComponent, data: {edit: true}},
    { path: 'clinicas', component: ClinicasComponent},
    { path: 'clinicas/adicionar', component: CadastrarClinicaComponent},
    { path: 'clinicas/editar/:id', component: CadastrarClinicaComponent, data: {edit: true}},
    { path: 'clientes',  component: ClientesComponent}
    
];
