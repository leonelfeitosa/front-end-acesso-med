import { Component, OnInit } from '@angular/core';
import { ClinicasService } from '../services/clinicas.service';

@Component({
  selector: 'app-clinicas',
  templateUrl: './clinicas.component.html',
  styleUrls: ['./clinicas.component.scss']
})
export class ClinicasComponent implements OnInit {

  clinicas: any = [];

  constructor(private clinicasService: ClinicasService) { }

  ngOnInit() {
    this.clinicasService.getClinicas().subscribe((clinicas) => {
      this.clinicas = clinicas;
    });
  }

}
