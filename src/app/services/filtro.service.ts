import { Injectable } from '@angular/core';
import { Estado } from '../models/estado';
import { Cidade } from '../models/cidade';

@Injectable({
  providedIn: 'root'
})
export class FiltroService {

  constructor() { }

  public filtroPesquisa(array: Array<any>, pesquisa: string): Array<any> {
    return array.filter((element) => {
      if (element.name.toLowerCase().startsWith(pesquisa.toLowerCase())) {
        return element;
      }
    });
  }
  public filtroPesquisaCliente(array: Array<any>, pesquisa: string): Array<any> {
    return array.filter((element) => {
      if (element.nome.toLowerCase().startsWith(pesquisa.toLowerCase())) {
        return element;
      }
    });
  }


  public filtroSituacao(array: Array<any>, situacao: string): Array<any> {
    if (situacao === 'todos') {
      return array;
    }
    if (situacao === 'ativos') {
      return array.filter((element) => {
        if (element.isActive) {
          return element;
        }
      });
    }
    if (situacao === 'inativos') {
      return array.filter((element) => !element.isActive);
    }
  }

  public filtroEstado(array: Array<any>, estado: Estado): Array<any> {
    return array.filter((element) => {
      if (typeof element.estado !== 'undefined') {
        if (estado.sigla.toLowerCase() === element.estado.toLowerCase()) {
          return element;
        }
      }
    });
  }

  public filtroCidade(array: Array<any>, cidade: Cidade): Array<any> {
    return array.filter((element) => {
      if (typeof element.cidade !== 'undefined') {
        if (element.cidade.toLowerCase() === cidade.nome.toLowerCase()) {
          return element
        }
      }
    })
  }
}
