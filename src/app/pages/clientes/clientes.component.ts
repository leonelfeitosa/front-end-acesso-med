import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { ClientesService } from '../../services/clientes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Estado } from '../../models/estado';
import { Cidade } from '../../models/cidade';
import { LocalService } from '../../services/local.service';
import { FiltroService } from '../../services/filtro.service';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  clientes: Array<Cliente> = [];
  filtros: Array<Cliente> = [];
  filtrosEstadoCidade: Array<Cliente> = [];
  loaded = false;
  estados: Estado[] = [];
  cidades: Cidade[] = [];
  cidadeOpcao = 'Selecione um estado';

  filtroGroup = new FormGroup({
    estado: new FormControl(''),
    cidade: new FormControl(''),
    pesquisa: new FormControl('')
  })

  constructor(private clientesService: ClientesService,
              private spinner: NgxSpinnerService,
              private localService: LocalService,
              private filtroService: FiltroService) { }

  ngOnInit() {
    this.spinner.show();
    this.getEstados();
    this.filtroGroup.get('estado').setValue('selecione', {emitEvent: false});
    this.filtroGroup.get('cidade').setValue('selecione', {emitEvent: false});
    this.configureForm();
    this.getClientes();
  }

  private getClientes(): void {
    this.clientesService.getClientes().subscribe((clientes) => {
      this.clientes = [...clientes];
      this.filtros = [...this.clientes];
      this.spinner.hide();
      this.loaded = true;
    });
  }

  getEstados() {
    this.localService.getEstados().subscribe((estados) => {
      this.estados = estados.map((estado) => {
        const newEstado = new Estado();
        newEstado.id = estado.id;
        newEstado.nome = estado.nome;
        newEstado.sigla = estado.sigla;
        return newEstado;
      });
    });
  }

  getCidades(id: number) {
    this.clearArray(this.cidades);
    this.localService.getCidades(id).subscribe((cidades) => {
      this.cidades = cidades.map((cidade) => {
        const newCidade = new Cidade();
        newCidade.nome = cidade.nome;
        return newCidade;
      })
    })
  }

  estadoSelecionado(estado: Estado) {
    this.clearArray(this.filtros);
    this.clearArray(this.cidades);
    if (estado.nome === 'todos') {
      this.filtros = [...this.clientes];
      this.cidadeOpcao = 'Selecione um estado';
    } else {
      this.filtrosEstadoCidade = this.filtroService.filtroEstado([...this.clientes], estado);
      this.filtros = [...this.filtrosEstadoCidade];
      this.getCidades(estado.id);
      this.cidadeOpcao = 'Selecione uma cidade';
    }
    this.filtroGroup.get('cidade').setValue('selecione', {emitEvent: false});
  }

  cidadeSelecionada(cidade: Cidade) {
    this.clearArray(this.filtros);
    this.filtros = this.filtroService.filtroCidade([...this.filtrosEstadoCidade], cidade);
  }

  filtrarPesquisa(filtro: string) {
    if (filtro.length > 0) {
      if (this.filtrosEstadoCidade.length > 0) {
        this.filtros = this.filtroService.filtroPesquisaCliente([...this.filtrosEstadoCidade], filtro);
      } else {
        this.filtros = this.filtroService.filtroPesquisaCliente([...this.clientes], filtro);
      }
    } else {
      this.filtros = [...this.clientes];
    }
  }

  configureForm() {
    this.filtroGroup.get('estado').valueChanges.subscribe((estado) => {
      this.estadoSelecionado(estado);
    });
    this.filtroGroup.get('pesquisa').valueChanges.subscribe((value) => {
      this.filtrarPesquisa(value);
    });
    this.filtroGroup.get('cidade').valueChanges.subscribe((value) => {
      this.cidadeSelecionada(value);
    })
  }

  clearArray(array: Array<any>) {
    while (array.length > 0) {
      array.pop();
    }
  }

}
