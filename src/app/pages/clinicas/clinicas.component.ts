import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicasService } from '../../services/clinicas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalComponent, SwalPartialTargets } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalService } from '../../services/local.service';
import { Estado } from '../../models/estado';
import { Cidade } from '../../models/cidade';
import { FiltroService } from '../../services/filtro.service';



declare var $: any;
@Component({
  selector: 'app-clinicas',
  templateUrl: './clinicas.component.html',
  styleUrls: ['./clinicas.component.scss']
})
export class ClinicasComponent implements OnInit {

  clinicas: any = [];
  filtros: any[] = [];
  filtrosEstadoCidade: any[] = [];
  clinicaAtual: any;
  loaded = false;
  estados: Array<Estado> = [];
  cidades: Array<Cidade> = [];
  cidadeOpcao = 'Selecione um estado';
  inativo = false;

  procedimentoGroup = new FormGroup({
    nome: new FormControl('', Validators.required),
    valor: new FormControl('', Validators.required)
  });

  filtroGroup = new FormGroup({
    estado: new FormControl('selecione'),
    cidade: new FormControl('selecione'),
    pesquisa: new FormControl('')
  })

  @ViewChild('procedimentosSwal') private procedimentoModal: SwalComponent;
  @ViewChild('edicaoSwal') private edicaoSwal: SwalComponent;
  @ViewChild('deletarProcedimentoSwal') private deletarProcedimentoSwal: SwalComponent;
  @ViewChild('deletarClinicaSwal') private deletarClinicaSwal: SwalComponent;

  constructor(private clinicasService: ClinicasService,
    public readonly swalTargets: SwalPartialTargets,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private localService: LocalService,
    private filtroService: FiltroService) { }

  ngOnInit() {
    this.getInativos();
    this.spinner.show();
    this.configureForm();
    this.getClinicas();
  }

  getEstados(): void {
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

  getCidades(estadoId: number): void {
    this.clearArray(this.cidades);
    const cidadeSubscription = this.localService.getCidades(estadoId).subscribe((cidades) => {
      cidades.forEach((cidade) => {
        const newCidade = new Cidade();
        newCidade.nome = cidade.nome;
        this.cidades.push(newCidade);
      });
      cidadeSubscription.unsubscribe();
    });
  }

  estadoSelecionado(valor: Estado): void {
    if (valor.nome === 'todos') {
      this.filtro('todos');
      this.cidadeOpcao = 'Selecione um estado';
    } else {
      this.cidadeOpcao = 'Selecione uma cidade';
      this.getCidades(valor.id);
      this.filtrosEstadoCidade = this.filtroService.filtroEstado([...this.clinicas], valor);
      this.clearArray(this.filtros);
      this.filtros = [...this.filtrosEstadoCidade];
    }
    this.filtroGroup.get('cidade').setValue('selecione', { emitEvent: false });
  }

  cidadeSelecionada(cidade: Cidade): void {
    this.clearArray(this.filtros);
    this.filtros = this.filtroService.filtroCidade(this.filtrosEstadoCidade, cidade);
  }

  async getClinicas() {
    this.clearArray(this.clinicas);
    this.clearArray(this.filtros);
    try {
      if (this.inativo) {
      const clinicas = await this.clinicasService.getInactiveClinicas().toPromise();
      this.clinicas = [...clinicas];
      for (let i = 0; i < this.clinicas.length; i++) {
        this.clinicas[i].collapsed = false;
      }
      this.filtros = clinicas;
      this.loaded = true;
      this.spinner.hide();
      } else {
        const clinicas = await this.clinicasService.getActiveClinicas().toPromise();
      this.clinicas = [...clinicas];
      for (let i = 0; i < this.clinicas.length; i++) {
        this.clinicas[i].collapsed = false;
      }
      this.filtros = clinicas;
      this.loaded = true;
      this.spinner.hide();
      }
      
    } catch (err) {
      console.log(err);
    }
  }

  async getInativos() {
    const dataSub = this.route.data.subscribe((data) => {
      this.inativo = data.inativo;
      
    });
  }

  async filtro(filtro: string) {
    this.clearArray(this.filtros);
    if (filtro === 'todos') {
      this.cidadeOpcao = 'Selecione um estado'
      this.clearArray(this.cidades);
      this.filtroGroup.get('cidade').setValue('selecione', { emitEvent: false });
      this.filtroGroup.get('estado').setValue('selecione', { emitEvent: false });
    }
  }

  async filtrarPesquisa(filtro: string) {
    this.clearArray(this.filtros);
    const tipo = this.filtroGroup.get('filtro').value;
    if (filtro.length > 0) {
      if (this.filtrosEstadoCidade.length > 0) {
        this.filtros = this.filtroService.filtroPesquisaClinica([...this.filtrosEstadoCidade], tipo, filtro);
      } else {
        this.filtros = this.filtroService.filtroPesquisaClinica([...this.clinicas], tipo, filtro);
      }
    } else {
      this.filtros = [...this.clinicas];
    }
  }

  private clearArray(array: Array<any>) {
    while (array.length > 0) {
      array.pop();
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

  abrirModal(clinica: any): void {
    this.clinicaAtual = clinica;
    this.procedimentoModal.show();
  }
  
  abrirModalEdicao(procedimento, clinica, index) {
    this.clinicaAtual = clinica;
    this.procedimentoGroup.get('nome').setValue(procedimento.nome);
    this.procedimentoGroup.get('valor').setValue(procedimento.valor);
    this.edicaoSwal.show();
    this.edicaoSwal.confirm.subscribe(async (e) => {
      const newProcedimento = {
        nome: this.procedimentoGroup.get('nome').value,
        valor: this.procedimentoGroup.get('valor').value,
      };
      this.clinicaAtual.procedimentos[index] = newProcedimento;
      await this.clinicasService.updateClinica(clinica.id, this.clinicaAtual).toPromise();
      this.getClinicas();
    });
    
  }

  abrirModalDeletarProcedimento(clinica, index) {
    this.clinicaAtual = clinica;
    this.deletarProcedimentoSwal.show();
    this.deletarProcedimentoSwal.confirm.subscribe(async (e) => {
      this.clinicaAtual.procedimentos.splice(index, 1);
      await this.clinicasService.updateClinica(clinica.id, this.clinicaAtual).toPromise();
      this.getClinicas();
    })
  }

  abrirModalDeletarClinica(clinicaId) {
    this.deletarClinicaSwal.show();
    this.deletarClinicaSwal.confirm.subscribe(async (e) => {
      await this.clinicasService.deleteClinica(clinicaId).toPromise();
      this.getClinicas();
    })
  }

  abrirEdicao(clinicaId): void {
    this.router.navigateByUrl(`/admin/clinicas/editar/${clinicaId}`);
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

  cadastrarProcedimento(): void {
    const procedimento = {
      nome: this.procedimentoGroup.value.nome,
      valor: this.procedimentoGroup.value.valor
    };
    this.clinicasService.addProcedimento(this.clinicaAtual.id, procedimento).subscribe((clinica) => {
      this.clearArray(this.filtros);
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
