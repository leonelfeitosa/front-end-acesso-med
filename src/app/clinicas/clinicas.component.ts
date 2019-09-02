import { Component, OnInit, ViewChild } from '@angular/core';
import { ClinicasService } from '../services/clinicas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalComponent, SwalPartialTargets } from '@sweetalert2/ngx-sweetalert2';


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

  procedimentoGroup = new FormGroup({
    nome: new FormControl('', Validators.required),
    valor: new FormControl('', Validators.required)
  })  

  @ViewChild('procedimentosSwal') private procedimentoModal:SwalComponent;

  constructor(private clinicasService: ClinicasService, private readonly swalTargets: SwalPartialTargets) { }

  ngOnInit() {
    this.getClinicas();
  }

  getClinicas() {
    this.clinicasService.getClinicas().subscribe((clinicas) => {
      this.clinicas = [...clinicas];
      for (let i = 0; i < this.clinicas.length; i++) {
        this.clinicas[i].collapsed = false;
      }
      this.filtros = clinicas;
    });
  }

  async filtro(filtro){
    if (filtro === 'todos'){
      this.limparFiltros();
      
      this.filtros = this.clinicas;
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
    console.log(filtro);
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
