import { Routes } from '@angular/router';
import { LocalResolverService } from '../../resolvers/local.resolver.service';
import { ComprasComponent } from '../../pages/compras/compras.component';


export const MedicoLayoutRoutes: Routes = [
    { path: 'compras', component: ComprasComponent}
];
