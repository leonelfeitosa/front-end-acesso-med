import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AgenteService } from '../services/agente.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  filtroName = 'Filtrar';
  agentes: any[] = [];
  filtros: any[] = [];
  filtroPesquisa: string;
  loaded: boolean = false;
  loading: boolean = true;
   
  constructor(private agenteService: AgenteService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.agenteService.getAgentes().subscribe((agentes) => {
      this.agentes = [...agentes];
      this.filtros = agentes;
      this.loaded = true;
      this.spinner.hide();
      this.loading = false;
    });
    }
    
  async filtro(filtro) {
    
    if (filtro === 'todos'){
      await this.limparFiltros();
      this.filtros = this.agentes;
      this.filtroName = 'Todos'
      return
    }
    if (filtro === 'ativos'){
      this.filtros = this.agentes.filter((agente) => {
        if (agente.isActive){
          return agente;
        }
      })
      
      this.filtroName = 'Ativos'
      return;
    }
    if (filtro === 'inativos'){
      this.filtros = this.agentes.filter((agente) => !agente.isActive)
      this.filtroName = 'Inativos'
      console.log(this.filtros);
      return;
    }
  }

  filtrarPesquisa(){
    let filtro = this.filtroPesquisa;
    if(this.filtroPesquisa.length>0){
    this.filtros = this.agentes.filter((agente) => {
      if(agente.name.toLowerCase().startsWith(filtro.toLowerCase())){
        return agente;
      }
    })
  }else{
    this.filtros = this.agentes;
  }
  }

  private limparFiltros(){
    while(this.filtros.length){
      this.filtros.pop();
    }
  }

}
