import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocalService } from '../services/local.service';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import { Estado } from '../models/estado';

@Injectable({
  providedIn: 'root'
})
export class LocalResolverService implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return Observable.forkJoin([
      this.localService.getEstados()
    ]).map(results => {
      const estados = results[0];
      const mappedEstados = estados.map((estado) => {
        const newEstado = new Estado();
        newEstado.nome = estado.nome;
        newEstado.id = estado.id;
        newEstado.sigla = estado.sigla;
        return newEstado;
      });
      return {estados: mappedEstados};
    })
  }

  constructor(private localService: LocalService) { }
}
