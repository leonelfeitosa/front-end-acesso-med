import { Component, OnInit } from '@angular/core';
import { Cliente } from '../models/cliente';
import { ClientesService } from '../services/clientes.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  clientes: Array<Cliente> = [];
  loaded: boolean = false;

  constructor(private clientesService: ClientesService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.getClientes();
  }

  private getClientes(): void {
    this.clientesService.getClientes().subscribe((clientes) => {
      this.clientes = [...clientes];
      this.spinner.hide();
      this.loaded = true;
    })
  }

}
