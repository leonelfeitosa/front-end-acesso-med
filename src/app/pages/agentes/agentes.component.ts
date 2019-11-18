import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgenteService } from '../../services/agente.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalService } from '../../services/local.service';
import { Estado } from '../../models/estado';
import { Cidade } from '../../models/cidade';
import { FormControl, FormGroup } from '@angular/forms';
import { FiltroService } from '../../services/filtro.service';
import { SwalComponent, SwalPartialTargets } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.css']
})
export class AgentesComponent implements OnInit {
  @ViewChild('cidadeSelect') cidadeSelect: ElementRef;
  @ViewChild('deletarSwal') modalDeletar: SwalComponent;
  filtroGroup: FormGroup = new FormGroup({
    estado: new FormControl('selecione'),
    cidade: new FormControl('selecione'),
    pesquisa: new FormControl(''),
    filtro: new FormControl('nome'),
  })
  agentes = [];
  filtros: any[] = [];
  filtrosEstadoCidade: any[] = [];
  filtroPesquisa: string;
  loaded = false;
  inativo = false;

  estados: Array<Estado> = [];
  cidades: Array<Cidade> = [];
  cidadeOpcao = 'Selecione um estado';
  constructor(private route: ActivatedRoute,
    private agenteService: AgenteService,
    public readonly swalTargets: SwalPartialTargets,
    private spinner: NgxSpinnerService,
    private localService: LocalService,
    private filtroService: FiltroService) { }

  ngOnInit() {
    this.getInativos();
    this.spinner.show();
    this.configureForm();
    this.getAgentes();
  }

  async getAgentes() {
    this.clearArray(this.agentes);
    this.clearArray(this.filtros);
    if (this.inativo) {
      const agentesSubscription = this.agenteService.getAgentesInativos().subscribe((retorno) => {

        this.agentes = [...retorno];
        this.filtros = [...this.agentes];
        this.loaded = true;
        this.spinner.hide();
      });

    } else {
      const agentesSubscription = this.agenteService.getAgentesAtivos().subscribe((retorno) => {
        this.agentes = [...retorno];
        this.filtros = [...this.agentes];
        this.loaded = true;
        this.spinner.hide();
        agentesSubscription.unsubscribe();
      });
    }

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

  getInativos() {
    try {
      const data = this.route.data.subscribe(d => {
        
        this.inativo = d.inativo;
      });

    } catch (err) {
      console.log(err);
    }
  }

  configureForm(): void {
    this.getEstados();
    this.filtroGroup.get('estado').valueChanges.subscribe((value) => {
      this.estadoSelecionado(value);
    });
    this.filtroGroup.get('cidade').valueChanges.subscribe((value) => {
      this.cidadeSelecionada(value);
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
    this.filtroGroup.get('cidade').setValue('selecione', { emitEvent: false });

  }

  async apagarAgente(agenteId) {
    try {
      await this.agenteService.apagarAgente(agenteId).toPromise();
      this.getAgentes();
    } catch (err) {
      console.log(err);
    }
  }

  abrirModal(agenteId) {
    this.modalDeletar.show();
    this.modalDeletar.confirm.subscribe((e) => {
      this.apagarAgente(agenteId);
    });
  }

  cidadeSelecionada(cidade: Cidade) {
    this.clearArray(this.filtros);
    this.filtros = this.filtroService.filtroCidade([...this.filtrosEstadoCidade], cidade);
  }

  filtro(filtro) {
    this.clearArray(this.filtros);
    if (filtro === 'todos') {
      this.cidadeOpcao = 'Selecione um estado'
      this.clearArray(this.cidades);
      this.filtroGroup.get('cidade').setValue('selecione', { emitEvent: false });
      this.filtroGroup.get('estado').setValue('selecione', { emitEvent: false });
    }
  }

  filtrarPesquisa(filtro: string) {
    const tipo = this.filtroGroup.get('filtro').value;
    if (this.filtro.length > 0) {
      if (this.filtrosEstadoCidade.length > 0) {
        this.filtros = this.filtroService.filtroPesquisaAgente([...this.filtrosEstadoCidade], tipo, filtro);
      } else {
        this.filtros = this.filtroService.filtroPesquisaAgente([...this.agentes], tipo, filtro);
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
