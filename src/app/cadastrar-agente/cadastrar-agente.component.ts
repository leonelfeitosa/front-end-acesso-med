import { Router } from '@angular/router';
import { AgenteService } from './../services/agente.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-cadastrar-agente',
  templateUrl: './cadastrar-agente.component.html',
  styleUrls: ['./cadastrar-agente.component.scss']
})
export class CadastrarAgenteComponent implements OnInit {

  public agente: any = {
    name: '',
    cpf: '',
    password: '',
    rg: '',
    telefone: '',
    email: '',
    endereco: ''
  };

  constructor(private agenteService: AgenteService, private router: Router) { }

  ngOnInit() {
  }

  public addAgente() {
    if (this.agente.name === '' ||
        this.agente.cpf === '' ||
        this.agente.password === '' ||
        this.agente.rg === '' ||
        this.agente.telefone === '') {
          $.notify({
            icon: '',
            message: 'Preencha todos os campos corretamente!!'
          }, {
            type: 'warning',
            timer: '1000',
            placement: {
              from: 'top',
              align: 'center'
            }
          });
        } else {
          this.agenteService.addAgente(this.agente).subscribe((retorno) => {
            $.notify({
              icon: '',
              message: 'Cadastrado com sucesso'
            }, {
              type: 'success',
              timer: '1000',
              placement: {
                from: 'top',
                align: 'center'
              }
            });
            this.router.navigateByUrl('/admin/agentes');
          })
        }
  }

}
