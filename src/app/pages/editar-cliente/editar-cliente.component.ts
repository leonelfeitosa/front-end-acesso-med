import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientesService } from '../../services/clientes.service';
import { LocalService } from '../../services/local.service';
declare var $: any;

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.scss']
})
export class EditarClienteComponent implements OnInit {

  clienteGroup = new FormGroup({
    nome: new FormControl(''),
    rg: new FormControl(''),
    cpf: new FormControl(''),
    endereco: new FormControl(''),
    estado: new FormControl(''),
    cidade: new FormControl(''),
    dataNasc: new FormControl('')
  });

  responsavelGroup = new FormGroup({
    nome: new FormControl(''),
    rg: new FormControl(''),
    cpf: new FormControl(''),
    endereco: new FormControl(''),
    estado: new FormControl(''),
    cidade: new FormControl(''),
    dataNasc: new FormControl('')
  });
  
  clienteId = '';
  hasResponsavel = true;
  estados = [];
  cidadesCliente = [];
  cidadesResponsavel = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private spinner: NgxSpinnerService,
              private clientesService:ClientesService,
              private localService:LocalService) { }

  ngOnInit() {
    this.getCliente();
    this.getEstados();
    this.configureForm();
  }

  private getCliente() {
    this.spinner.show();
    this.route.params.subscribe(async (params) => {
      try {
        this.clienteId = params.id;
        const cliente = await this.clientesService.getCliente(this.clienteId).toPromise();
        if (Object.keys(cliente.responsavel).length === 0) {
          this.hasResponsavel = false;
        }
        this.setCliente(cliente);
        if (this.hasResponsavel) {
          this.setResponsavel(cliente.responsavel);
        }
      }catch(err) {
        console.log(err);
      }
      
    });
  }

  private async getEstados() {
    try {
      const estados = await this.localService.getEstados().toPromise();
      this.estados = estados;
    }catch(err) {
      console.log(err);
    }
  }

  private async getCidadesCliente(estadoId) {
    this.clearArray(this.cidadesCliente);
    try {
      const cidades = await this.localService.getCidades(estadoId).toPromise();
      this.cidadesCliente = cidades;
    }catch(err) {
      console.log(err);
    }
  }
  private async getCidadesResponsavel(estadoId) {
    this.clearArray(this.cidadesResponsavel);
    try {
      const cidades = await this.localService.getCidades(estadoId).toPromise();
      this.cidadesResponsavel = cidades;
    }catch(err) {
      console.log(err);
    }
  }
  
  private async setCliente(cliente) {
    this.clienteGroup.get('nome').setValue(cliente.nome);
    this.clienteGroup.get('rg').setValue(cliente.rg);
    this.clienteGroup.get('cpf').setValue(cliente.cpf);
    this.clienteGroup.get('endereco').setValue(cliente.endereco);
    const estado = this.estados.find((estado) => {
      return estado.sigla.toLowerCase() === cliente.estado.toLowerCase();
    });
    this.clienteGroup.get('estado').setValue(estado);
    await this.getCidadesCliente(estado.id);
    const cidade = this.cidadesCliente.find((cidade) => {
      return cidade.nome.toLowerCase() === cliente.cidade.toLowerCase();
    });
    this.clienteGroup.get('cidade').setValue(cidade);
    const dataNasc = this.parseDatetoInput(cliente.data_nascimento);
    this.clienteGroup.get('dataNasc').setValue(dataNasc);
  }

  private async setResponsavel(responsavel) {
    this.responsavelGroup.get('nome').setValue(responsavel.nome);
    this.responsavelGroup.get('rg').setValue(responsavel.rg);
    this.responsavelGroup.get('cpf').setValue(responsavel.cpf);
    this.responsavelGroup.get('endereco').setValue(responsavel.endereco);
    const estado = this.estados.find((estado) => {
      return estado.sigla.toLowerCase() === responsavel.estado.toLowerCase();
    });
    this.responsavelGroup.get('estado').setValue(estado);
    await this.getCidadesResponsavel(estado.id);
    const cidade = this.cidadesResponsavel.find((cidade) => {
      return cidade.nome.toLowerCase() === responsavel.cidade.toLowerCase();
    });
    this.responsavelGroup.get('cidade').setValue(cidade);
    const dataNasc = this.parseDatetoInput(responsavel.data_nascimento);
    this.responsavelGroup.get('dataNasc').setValue(dataNasc);
    this.spinner.hide();
  }

  private parseDatetoInput(dataNasc: string) {
    const sep = dataNasc.split('/');
    if (sep[1].length === 1) {
      sep[1] = `0${sep[1]}`;
    }
    if (sep[0].length === 1) {
      sep[0] = `0${sep[0]}`;
    }
    return `${sep[2]}-${sep[1]}-${sep[0]}`;
  }

  private parseInputToDate(input: string) {
    const sep = input.split('-');
    return `${sep[2]}/${sep[1]}/${sep[0]}`;
  }

  public async submit() {
    this.spinner.show();
    const cliente: any = {
      nome: this.clienteGroup.get('nome').value,
      rg: this.clienteGroup.get('rg').value,
      cpf: this.clienteGroup.get('cpf').value,
      endereco: this.clienteGroup.get('endereco').value,
      estado: this.clienteGroup.get('estado').value.sigla.toLowerCase(),
      cidade: this.clienteGroup.get('cidade').value.nome,
      data_nascimento: this.parseInputToDate(this.clienteGroup.get('dataNasc').value)
    };
    if (this.hasResponsavel) {
      cliente.responsavel = {
        nome: this.responsavelGroup.get('nome').value,
        rg: this.responsavelGroup.get('rg').value,
        cpf: this.responsavelGroup.get('cpf').value,
        endereco: this.responsavelGroup.get('endereco').value,
        estado: this.responsavelGroup.get('estado').value.sigla.toLowerCase(),
        cidade: this.responsavelGroup.get('cidade').value.nome,
        data_nascimento: this.parseInputToDate(this.responsavelGroup.get('dataNasc').value)
      };
    }
    await this.clientesService.updateCliente(this.clienteId, cliente).toPromise();
    $.notify({
      icon: '',
      message: 'Editado com sucesso'
    }, {
      type: 'info',
      timer: '1000',
      placement: {
        from: 'top',
        align: 'center'
      }
    });
    this.spinner.hide();
    this.router.navigateByUrl('/admin/clientes');
  }

  private configureForm() {
    this.clienteGroup.get('estado').valueChanges.subscribe((value) => {
      this.getCidadesCliente(value.id);
    });
    this.responsavelGroup.get('estado').valueChanges.subscribe((value) => {
      this.getCidadesResponsavel(value.id);
    });
  }

  private clearArray(array: Array<any>) {
    while (array.length > 0) {
      array.pop();
    }
  }

}
