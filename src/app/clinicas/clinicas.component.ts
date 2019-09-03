import { Component, OnInit, ViewChild } from '@angular/core';
import { ClinicasService } from '../services/clinicas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalComponent, SwalPartialTargets } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalService } from '../services/local.service';
import { Estado } from '../models/estado';
import { Cidade } from '../models/cidade';


declare var $: any;
@Component({
  selector: 'app-clinicas',
  templateUrl: './clinicas.component.html',
  styleUrls: ['./clinicas.component.scss']
})
export class ClinicasComponent implements OnInit {

  clinicas: any = [];
  filtros: any[] = [];
  filtroPesquisa: string;
  filtroName = 'Filtrar';
  clinicaAtual: any;
  loaded: boolean = false;
  estados: Array<Estado> = [];
  cidades: Array<Cidade> = [];
  cidadeOpcao: string = 'Selecione um Estado'

  procedimentoGroup = new FormGroup({
    nome: new FormControl('', Validators.required),
    valor: new FormControl('', Validators.required)
  })  

  @ViewChild('procedimentosSwal') private procedimentoModal:SwalComponent;

  constructor(private clinicasService: ClinicasService, 
              private readonly swalTargets: SwalPartialTargets,
              private spinner: NgxSpinnerService,
              private localService: LocalService) { }

  ngOnInit() {
    this.spinner.show();
    this.getEstados();
    this.getClinicas();
  }

  getEstados() {
    this.localService.getEstados().subscribe((estados) => {
      estados.forEach((estado) => {
        const newEstado = new Estado();
        newEstado.id = estado.id;
        newEstado.nome = estado.nome;
        newEstado.sigla = estado.sigla;
        this.estados.push(newEstado);
      })
    })
  }

  getCidades(estadoId: number) {
    this.localService.getCidades(estadoId).subscribe((cidades) => {
      cidades.forEach((cidade) => {
        const newCidade = new Cidade();
        newCidade.nome = cidade.nome;
        this.cidades.push(newCidade);
      });
    });
  }

  estadoSelecionado(valor) {
    
    if (valor.nome === 'todos'){
      this.filtro('todos');
    }else {
      this.cidadeOpcao = 'Cidade';
      this.getCidades(valor.id);
      this.limparFiltros();
      this.filtros = this.clinicas.filter((clinica) => {
        if (typeof clinica.estado !== 'undefined'){
        if (valor.sigla.toLowerCase() === clinica.estado.toLowerCase()) {
          return clinica;
        }
      }
      })
    }
    
  }

  cidadeSelecionada(cidade) {
    this.limparFiltros();
    this.filtros = this.clinicas.filter((clinica) => {
      if (typeof clinica.cidade !== 'undefined'){
        if (cidade.nome.toLowerCase() === clinica.cidade.toLowerCase()) {
            return clinica;
        }
      }
    })
  }

  getClinicas() {
    this.clinicasService.getClinicas().subscribe((clinicas) => {
      this.clinicas = [...clinicas];
      for (let i = 0; i < this.clinicas.length; i++) {
        this.clinicas[i].collapsed = false;
      }
      this.filtros = clinicas;
      this.loaded = true;
      this.spinner.hide();
    });
  }

  async filtro(filtro){
    if (filtro === 'todos'){
      this.limparFiltros();
      
      this.filtros = [...this.clinicas];
      this.filtroName = 'Todos'
      return
    }

    if (filtro === 'ativos'){
      this.filtros = this.clinicas.filter((clinica) => {
        if(clinica.isActive){
          return clinica;
        }
      })
      this.filtroName = 'Ativos';
      return;
    }
    if (filtro === 'inativos'){
      this.filtros = this.clinicas.filter((agente) => !agente.isActive)
      this.filtroName = 'Inativos'
      
      return;
    }

  }
  async filtrarPesquisa(){
    let filtro = this.filtroPesquisa;
    if(this.filtroPesquisa.length>0){
    this.filtros = this.clinicas.filter((clinica) => {
      if(clinica.name.toLowerCase().startsWith(filtro.toLowerCase())){
        return clinica;
      }
    })
  }else{
    this.filtros = this.clinicas;
  }
  }

  private limparFiltros(){
    while(this.filtros.length){
      this.filtros.pop();
    }
  }

  collapse(index: number): void {
    this.clinicas[index].collapsed = !this.clinicas[index].collapsed;
    for (let i = 0; i < this.clinicas.length; i++) {
      if (this.clinicas[i].collapsed && i !== index) {
        this.clinicas[i].collapsed = false;
      }
    }
  }

  abrirModal(clinica: any) {
    this.clinicaAtual = clinica;
    this.procedimentoModal.show();
  }

  cadastrarProcedimento () {
    let procedimento = {
      nome: this.procedimentoGroup.value.nome,
      valor: this.procedimentoGroup.value.valor
    };
    this.clinicasService.addProcedimento(this.clinicaAtual.id, procedimento).subscribe((clinica) => {
      this.limparFiltros();
      this.getClinicas();
      $.notify({
        icon: '',
        message: 'Procedimento adicionado'
      }, {
        type: 'info',
        timer: '1000',
        placement: {
          from: 'top',
          align: 'center'
        }
      });
    })
  }

}
