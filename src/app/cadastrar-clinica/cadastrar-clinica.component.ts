import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { confirmarSenha } from '../shared/confirmar-senha.directive';
import { ClinicasService } from '../services/clinicas.service';
import { LocalService } from '../services/local.service';

declare var $: any;

class Estado {
  id: number;
  nome: string;
  sigla: string;
}

class Cidade {
  nome: string;
}

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
    endereco: new FormControl(''),
    estado: new FormControl(''),
    cidade: new FormControl('')
  }, {validators: confirmarSenha});

  edit: boolean = false;
  clinicaId: string;
  currentClinica: any = {};
  clinicaActive: boolean;
  submitted: boolean = false;

  estados: Array<Estado> = [];
  cidades: Array<Cidade> = [];
  estadoName: string = '';
  cidadeName: string = '';

  constructor(private clinicasService: ClinicasService,
              private router: Router,
              private route: ActivatedRoute,
              private localService: LocalService) { }

  ngOnInit() {
    this.getEstados();
    this.route.data.subscribe((dataSnapshot) => {
      if(dataSnapshot.hasOwnProperty('edit') && dataSnapshot.edit){
        this.getClinica();
      }
    });
    console.log(this.estados);
  }


  public getClinica() {
    this.route.params.subscribe((paramsSnapshot) => {
      this.clinicaId = paramsSnapshot['id'];
      this.edit = true;
      this.clinicasService.getClinica(this.clinicaId).subscribe((clinica) => {
        console.log(clinica)
        this.clinicaGroup.get('name').setValue(clinica.name);
        this.clinicaGroup.get('cnpj').setValue(clinica.cnpj);
        this.clinicaGroup.get('endereco').setValue(clinica.endereco);
        this.clinicaActive = clinica.isActive;
        this.currentClinica = clinica;
        const estado = this.findEstado(clinica.estado);
        this.estadoSelecionado(estado);
        this.cidadeSelecionada(clinica.cidade);
      });
    });
  }

  public getEstados(): void {
    this.localService.getEstados().subscribe((estados) => {
      estados.forEach(element => {
        const estado = new Estado()
        estado.id = element.id;
        estado.nome = element.nome;
        estado.sigla = element.sigla;
        this.estados.push(estado);
      });
    });
  }

  public estadoSelecionado(estado: Estado) {
    this.estadoName = estado.nome;
    this.clinicaGroup.get('estado').setValue(estado.sigla);
    this.localService.getCidades(estado.id).subscribe((cidades) => {
      cidades.forEach(element => {
        const cidade = new Cidade();
        cidade.nome = element.nome;
        this.cidades.push(cidade);
      });
    });
    this.cidadeName = 'Selecione uma Cidade';
  }

  public cidadeSelecionada(cidadeNome: string) {
    this.clinicaGroup.get('cidade').setValue(cidadeNome);
    this.cidadeName = cidadeNome;
  }

  findEstado(sigla: string) {
    return this.estados.find((estado) => {
      if (sigla.toLowerCase() === estado.sigla.toLowerCase()){
        return true
      }
      return false
    });
  }

  public addClinica() {
    if (this.clinicaGroup.valid){
      const newClinica: any = {
        name: this.clinicaGroup.value.name,
        password: this.clinicaGroup.value.password,
        cnpj: this.clinicaGroup.value.cnpj,
        endereco: this.clinicaGroup.value.endereco,
        estado: this.clinicaGroup.value.estado,
        cidade: this.clinicaGroup.value.cidade
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
