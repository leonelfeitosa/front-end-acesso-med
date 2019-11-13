import { Injectable } from '@angular/core';
import { Estado } from '../models/estado';
import { Cidade } from '../models/cidade';

@Injectable({
  providedIn: 'root'
})
export class FiltroService {

  constructor() { }

  public filtroPesquisaAgente(array: Array<any>, tipo: string, pesquisa: string): Array<any> {
    if (tipo === 'nome') {
      return array.filter((element) => {
        if (element.name.toLowerCase().startsWith(pesquisa.toLowerCase())) {
          return element;
        }
      });
    } else if (tipo === 'cpf') {
      return array.filter((element) => {
        if (element.cpf.toLowerCase().startsWith(pesquisa.toLowerCase())) {
          return element;
        }
      })
    }
  }
  public filtroPesquisaClinica(array: Array<any>, tipo: string, pesquisa: string): Array<any> {
    if (tipo === 'nome') {
      return array.filter((element) => {
        if (element.name.toLowerCase().startsWith(pesquisa.toLowerCase())) {
          return element;
        }
      });
    } else if (tipo === 'cnpj') {
      return array.filter((element) => {
        if (element.cnpj.toLowerCase().startsWith(pesquisa.toLowerCase())) {
          return element;
        }
      })
    }
  }
  public filtroPesquisaCliente(array: Array<any>, tipo:string, pesquisa: string): Array<any> {
    if (tipo === 'nome') {
      return array.filter((element) => {
        if (element.nome.toLowerCase().startsWith(pesquisa.toLowerCase())) {
          return element;
        }
      });
    } else if (tipo === 'cpf') {
      return array.filter((element) => {
        if (element.cpf.toLowerCase().startsWith(pesquisa.toLowerCase())) {
          return element;
        }
      });
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
