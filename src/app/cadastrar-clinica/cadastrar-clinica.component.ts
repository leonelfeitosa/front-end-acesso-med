import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  edit: boolean = false;
  clinicaId: string;
  currentClinica: any = {};
  clinicaActive: boolean;
  submitted: boolean = false;

  constructor(private clinicasService: ClinicasService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((dataSnapshot) => {
      if(dataSnapshot.hasOwnProperty('edit') && dataSnapshot.edit){
        this.route.params.subscribe((paramsSnapshot) => {
          this.clinicaId = paramsSnapshot['id'];
          this.edit = true;
          this.clinicasService.getClinica(this.clinicaId).subscribe((clinica) => {
            console.log(clinica)
            this.clinicaGroup.get('name').setValue(clinica.name);
            this.clinicaGroup.get('cnpj').setValue(clinica.cnpj);
            this.clinicaGroup.get('endereco').setValue(clinica.endereco);
            this.clinicaActive = clinica.isActive;
            console.log(this.clinicaActive)
            this.currentClinica = clinica;
          });
        });
      }
    });
  }

  public addClinica() {
    if (this.clinicaGroup.valid){
      const newClinica: any = {
        name: this.clinicaGroup.value.name,
        password: this.clinicaGroup.value.password,
        cnpj: this.clinicaGroup.value.cnpj,
        endereco: this.clinicaGroup.value.endereco
      };
      if (this.edit){
        this.clinicasService.updateClinica(this.clinicaId, newClinica).subscribe((clinica) => {
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
          this.router.navigateByUrl('/admin/clinicas');
        })
      }else{
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

  public desativarClinica(){
    if(this.edit){
      const newClinica = {
        isActive: !this.clinicaActive
      };
      this.clinicasService.updateClinica(this.clinicaId, newClinica).subscribe(() => {
        $.notify({
          icon: '',
          message: 'Clinica desativada'
        }, {
          type: 'info',
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
