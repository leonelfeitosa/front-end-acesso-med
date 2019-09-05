import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AgenteService } from '../../services/agente.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalService } from '../../services/local.service';
import { Estado } from '../../models/estado';
import { Cidade } from '../../models/cidade';
import { FormControl, FormGroup } from '@angular/forms';
import { FiltroService } from '../../services/filtro.service';

@Component({
  selector: 'app-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.css']
})
export class AgentesComponent implements OnInit {
  @ViewChild('cidadeSelect') cidadeSelect: ElementRef;
  filtroGroup: FormGroup = new FormGroup({
    estado: new FormControl('selecione'),
    cidade: new FormControl('selecione'),
    pesquisa: new FormControl(''),
    situacao: new FormControl('todos')
  })
  agentes = [];
  filtros: any[] = [];
  filtrosEstadoCidade: any[] = [];
  filtroPesquisa: string;
  loaded = false;

  estados: Array<Estado> = [];
  cidades: Array<Cidade> = [];
  cidadeOpcao = 'Selecione um estado';
  constructor(private agenteService: AgenteService,
    private spinner: NgxSpinnerService,
    private localService: LocalService,
    private filtroService: FiltroService) { }

  ngOnInit() {
    this.spinner.show();
    this.configureForm();
    this.getAgentes();
  }

  getAgentes(): void {
    const agentesSubscription = this.agenteService.getAgentes().subscribe((retorno) => {
      this.agentes = [...retorno];
      this.filtros = [...this.agentes];
      this.loaded = true;
      this.spinner.hide();
      agentesSubscription.unsubscribe();
    });
  }

  getEstados() {
    const estadosSubscription = this.localService.getEstados().subscribe((estados) => {
      estados.forEach((estado) => {
        const newEstado = new Estado();
        newEstado.id = estado.id;
        newEstado.nome = estado.nome;
        newEstado.sigla = estado.sigla;
        this.estados.push(newEstado);
      });
      estadosSubscription.unsubscribe();
    })
  }

  getCidades(estadoId: number) {
    const cidadesSubscription = this.localService.getCidades(estadoId).subscribe((cidades) => {
      cidades.forEach((cidade) => {
        const newCidade = new Cidade();
        newCidade.nome = cidade.nome;
        this.cidades.push(newCidade);
      });
      this.cidadeOpcao = 'Selecione uma cidade';
      cidadesSubscription.unsubscribe();
    }
    );
  }

  configureForm(): void {
    this.getEstados();
    this.filtroGroup.get('estado').valueChanges.subscribe((value) => {
      this.estadoSelecionado(value);
    });
    this.filtroGroup.get('cidade').valueChanges.subscribe((value) => {
      this.cidadeSelecionada(value);
    });
    this.filtroGroup.get('situacao').valueChanges.subscribe((value) => {
      this.filtro(value);
    });
    this.filtroGroup.get('pesquisa').valueChanges.subscribe((value) => {
      this.filtrarPesquisa(value);
    })
  }
  estadoSelecionado(valor: Estado) {
    if (valor.nome === 'todos') {
      this.filtro('todos');
      this.cidadeOpcao = 'Selecione um estado';
    } else {
      this.cidadeOpcao = 'Selecione uma cidade';
      this.clearArray(this.filtros);
      this.clearArray(this.cidades);
      this.getCidades(valor.id);
      this.filtrosEstadoCidade = this.filtroService.filtroEstado([...this.agentes], valor);
      this.filtros = [...this.filtrosEstadoCidade];
    }
    this.filtroGroup.get('cidade').setValue('selecione', {emitEvent: false});

  }

  cidadeSelecionada(cidade: Cidade) {
    this.clearArray(this.filtros);
    this.filtros = this.filtroService.filtroCidade([...this.filtrosEstadoCidade], cidade);
  }

  filtro(filtro) {
    this.clearArray(this.filtros);
    this.filtros = this.filtroService.filtroSituacao([...this.agentes], filtro);
    if (filtro === 'todos') {
      this.cidadeOpcao = 'Selecione um estado'
      this.clearArray(this.cidades);
      this.filtroGroup.get('cidade').setValue('selecione', {emitEvent: false});
      this.filtroGroup.get('estado').setValue('selecione', {emitEvent: false});
    }
  }

  filtrarPesquisa(filtro: string) {
    if (this.filtro.length > 0) {
      if (this.filtrosEstadoCidade.length > 0) {
        this.filtros = this.filtroService.filtroPesquisa([...this.filtrosEstadoCidade], filtro);
      } else {
        this.filtros = this.filtroService.filtroPesquisa([...this.agentes], filtro);
      }
    } else {
      this.filtros = [...this.agentes];
    }
  }

  private clearArray(array: Array<any>) {
    while (array.length > 0) {
      array.pop();
    }
  }

}
