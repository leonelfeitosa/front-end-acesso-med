import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { CadastrarAgenteComponent } from '../../cadastrar-agente/cadastrar-agente.component';
import { ClinicasComponent } from '../../clinicas/clinicas.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'admin/agentes',      component: HomeComponent },
    { path: 'admin/agentes/adicionar', component: CadastrarAgenteComponent},
    { path: 'admin/clinicas', component: ClinicasComponent}
    
];
