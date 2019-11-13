import { Routes } from '@angular/router';
import { LocalResolverService } from '../../resolvers/local.resolver.service';

import { AgentesComponent } from '../../pages/agentes/agentes.component';
import { CadastrarAgenteComponent } from '../../pages/cadastrar-agente/cadastrar-agente.component';
import { ClinicasComponent } from '../../pages/clinicas/clinicas.component';
import { CadastrarClinicaComponent } from '../../pages/cadastrar-clinica/cadastrar-clinica.component';
import { ClientesComponent } from '../../pages/clientes/clientes.component';
import { EditarClienteComponent } from '../../pages/editar-cliente/editar-cliente.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'agentes',      component: AgentesComponent, data: {inativo: false} },
    { path: 'agentes/inativos', component: AgentesComponent, data: {inativo: true} },
    { path: 'agentes/adicionar', component: CadastrarAgenteComponent, resolve: {pageData: LocalResolverService}},
    { path: 'agentes/editar/:id', component: CadastrarAgenteComponent, data: {edit: true}, resolve: {pageData: LocalResolverService}},
    { path: 'clinicas', component: ClinicasComponent, data: {inativo: false}},
    { path: 'clinicas/inativos', component: ClinicasComponent, data: {inativo: true}},
    { path: 'clinicas/adicionar', component: CadastrarClinicaComponent, resolve: {pageData: LocalResolverService}},
    { path: 'clinicas/editar/:id', component: CadastrarClinicaComponent, data: {edit: true}, resolve: {pageData: LocalResolverService}},
    { path: 'clientes',  component: ClientesComponent},
    { path: 'clientes/editar/:id', component: EditarClienteComponent }

];
