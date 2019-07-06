import { AuthService } from './../services/auth.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';


declare var $: any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  auth: any =  {
    username: '',
    password: ''
  }

  constructor(private authService: AuthService,
              private fireAuth: AngularFireAuth,
              private router: Router) {this.checkToken(); }

  ngOnInit() {
  }

  public checkToken() {
     this.authService.checkToken().subscribe(() => {
       this.router.navigateByUrl('admin/agentes');
     });
  }

  public authenticate() {
    if (this.auth.username === '' ||
        this.auth.password === '') {
          $.notify({
            icon: '',
            message: 'Preencha todos os campos corretamente'
          }, {
            type: 'danger',
            timer: '1000',
            placement: {
              from: 'top',
              align: 'center'
            }
          });
        } else {
          this.authService.login(this.auth).subscribe((result) => {
              this.fireAuth.auth.signInWithCustomToken(result.token);
              this.fireAuth.auth.currentUser.getIdToken().then((token) => {
                localStorage.setItem('token', token);
                this.router.navigateByUrl('admin/agentes');
              });
          }, (error) => {
            const erro = error.error;
            console.log(erro);
            if (typeof erro.message !==  'undefined') {

              if (erro.message === 'Username incorreto') {
                $.notify({
                  icon: '',
                  message: 'CPF incorreto'
                }, {
                  type: 'danger',
                  timer: '1000',
                  placement: {
                    from: 'top',
                    align: 'center'
                  }
                });
              }
              if (erro.message === 'Senha incorreta') {
                console.log('entrou')
                $.notify({
                  icon: '',
                  message: 'Senha incorreta'
                }, {
                  type: 'danger',
                  timer: '1000',
                  placement: {
                    from: 'top',
                    align: 'center'
                  }
                });
              }
            }
          })
        }
  }

}
