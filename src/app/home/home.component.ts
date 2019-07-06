import { Component, OnInit } from '@angular/core';
import { AgenteService } from '../services/agente.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  agentes: any[] = [];
   
  constructor(private agenteService: AgenteService) { }

  ngOnInit() {
    this.agenteService.getAgentes().subscribe((agentes) => {
      this.agentes = agentes;
    })
    }

}
