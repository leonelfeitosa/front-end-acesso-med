import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { confirmarSenha } from '../../shared/confirmar-senha.directive';
import { ClinicasService } from '../../services/clinicas.service';
import { LocalService } from '../../services/local.service';
import { Estado } from '../../models/estado';
import { Cidade } from '../../models/cidade';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
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
    endereco: new FormControl(''),
    estado: new FormControl(''),
    cidade: new FormControl(''),
    
  }, {validators: confirmarSenha});

  edit = false;
  clinicaId: string;
  currentClinica: any = {};
  clinicaActive: boolean;
  submitted = false;

  estados: Array<Estado> = [];
  cidades: Array<Cidade> = [];
  cidadeOpcao = 'Selecione um estado';

  constructor(private clinicasService: ClinicasService,
              private router: Router,
              private route: ActivatedRoute,
              private localService: LocalService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    console.log(this.edit);
    this.configureForm();
    this.estados = this.route.snapshot.data.pageData.estados;
    this.clinicaGroup.get('estado').setValue('selecione', {emitEvent: false});
    this.clinicaGroup.get('cidade').setValue('selecione', {emitEvent: false})
    this.route.data.subscribe((dataSnapshot) => {
      if (dataSnapshot.hasOwnProperty('edit') && dataSnapshot.edit) {
        this.spinner.show();
        this.getClinica();
      }
    });
  }

  public getClinica() {
    this.route.params.subscribe((paramsSnapshot) => {
      this.clinicaId = paramsSnapshot['id'];
      this.edit = true;
      this.clinicasService.getClinica(this.clinicaId).subscribe(async (clinica) => {
        this.clinicaGroup.get('name').setValue(clinica.name);
        this.clinicaGroup.get('cnpj').setValue(clinica.cnpj);
        this.clinicaGroup.get('endereco').setValue(clinica.endereco);
        this.clinicaActive = clinica.isActive;
        this.currentClinica = clinica;
        const estado = this.findEstado(clinica.estado);
        this.clinicaGroup.get('estado').setValue(estado, {emitEvent: false});
        await this.estadoSelecionado(estado);
        const cidade = this.findCidade(clinica.cidade);
        this.clinicaGroup.get('cidade').setValue(cidade, {emitEvent: false});
        this.spinner.hide();
      });
    });
  }

  public async getEstados() {
    this.clearArray(this.estados);
     this.localService.getEstados().subscribe((estados) => {
      this.estados = estados.map((estado) => {
        const newEstado = new Estado();
        newEstado.id = estado.id;
        newEstado.nome = estado.nome;
        newEstado.sigla = estado.sigla;
        return newEstado;
      });
     });
  }

  public async estadoSelecionado(estado: Estado) {
    this.clearArray(this.cidades);
    const cidades = await this.localService.getCidades(estado.id).toPromise();
    this.cidades = await Promise.all(cidades.map(async (cidade) => {
      const newCidade = new Cidade();
      newCidade.nome = cidade.nome;
      return newCidade;
    }));
    this.clinicaGroup.get('cidade').setValue('selecione', {emitValue: false});
    this.cidadeOpcao = 'Selecione uma cidade';
  }


  clearArray(values: Array<any>) {
    while (values.length) {
      values.pop();
    }
  }

  configureForm() {
    this.clinicaGroup.get('estado').valueChanges.subscribe((value) => {
      this.estadoSelecionado(value);
    });
  }

  findEstado(sigla: string) {
    return this.estados.find((estado) => {
      return estado.sigla.toLowerCase() === sigla.toLowerCase();
    });
  }

  findCidade(nome: string) {
    return this.cidades.find((cidade) => {
      return cidade.nome.toLowerCase() === nome.toLowerCase();
    });
  }

  public addClinica() {
    if (this.clinicaGroup.valid) {
      this.spinner.show();
    
      const newClinica: any = {
        name: this.clinicaGroup.value.name,
        password: this.clinicaGroup.value.password,
        cnpj: this.clinicaGroup.value.cnpj,
        endereco: this.clinicaGroup.value.endereco,
        estado: this.clinicaGroup.value.estado.sigla,
        cidade: this.clinicaGroup.value.cidade.nome,
      };
      if (this.edit) {
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
        }, () => {
          this.spinner.hide();
        })
      } else {
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
      }, () => {
        this.spinner.hide();
      })
    }
    }
  }

  public desativarClinica() {
    if (this.edit) {
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
