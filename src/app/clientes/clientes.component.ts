import { Component, OnInit } from '@angular/core';
import { Cliente } from '../models/cliente';
import { ClientesService } from '../services/clientes.service';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  clientes: Array<Cliente> = [];

  constructor(private clientesService: ClientesService) { }

  ngOnInit() {
    this.getClientes();
  }

  private getClientes(): void {
    this.clientesService.getClientes().subscribe((clientes) => {
      this.clientes = [...clientes];
    })
  }

}
