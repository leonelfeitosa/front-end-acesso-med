import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { confirmarSenha } from '../shared/confirmar-senha.directive';
import { ClinicasService } from '../services/clinicas.service';

declare var $: any;

@Component({
  selector: 'app-cadastrar-clinica',
  templateUrl: './cadastrar-clinica.component.html',
  styleUrls: ['./cadastrar-clinica.component.scss']
})
export class CadastrarClinicaComponent implements OnInit {

  clinicaGroup = new FormGroup({
    name: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    cnpj: new FormControl(''),
    endereco: new FormControl('')
  }, {validators: confirmarSenha});

  constructor(private clinicasService: ClinicasService,
              private router: Router) { }

  ngOnInit() {
  }

  public addClinica() {
    if (this.clinicaGroup.valid){
      const newClinica = {
        name: this.clinicaGroup.value.name,
        password: this.clinicaGroup.value.password,
        cnpj: this.clinicaGroup.value.cnpj,
        endereco: this.clinicaGroup.value.endereco
      };
      this.clinicasService.addClinica(newClinica).subscribe((result) => {
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
        this.router.navigateByUrl('/admin/clinicas');
      })
    }
  }

}
