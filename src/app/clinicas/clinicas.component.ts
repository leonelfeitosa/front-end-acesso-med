import { Component, OnInit } from '@angular/core';
import { ClinicasService } from '../services/clinicas.service';

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

  constructor(private clinicasService: ClinicasService) { }

  ngOnInit() {
    this.clinicasService.getClinicas().subscribe((clinicas) => {
      this.clinicas = clinicas;
      this.filtros = clinicas;
    });
  }

  async filtro(filtro){
    if (filtro === 'todos'){
      await this.limparFiltros();
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



}
