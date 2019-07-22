import { AuthService } from './../services/auth.service';
import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';


declare var $: any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  authGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });
  auth: any =  {
    username: '',
    password: ''
  };
  authValidation = {
    username: false,
    password: false
  };
  authExists = {
    username: false,
    password: false
  };
  

  constructor(private authService: AuthService,
              private fireAuth: AngularFireAuth,
              private router: Router) { }

  ngOnInit() {
    this.authGroup.get('username').valueChanges.subscribe(() => {
      this.authValidation.username = false;
      this.authValidation.password = false;
      this.authExists.username = false;
      this.authExists.password = false;
    })
  }



  public authenticate() {
    console.log(this.authGroup.value.username)
    if (this.authGroup.value.username === '') {
          this.authExists.username = true;
        } else if(this.authGroup.value.password === ''){
          this.authExists.password = true;
        } else {
          this.auth = {
            username: this.authGroup.value.username,
            password: this.authGroup.value.password
          };
          this.authService.login(this.auth).subscribe(async (result) => {
              await this.fireAuth.auth.signInWithCustomToken(result.token);
              this.fireAuth.auth.currentUser.getIdTokenResult().then((tokenResult) => {
                console.log(tokenResult.claims.type);
              });
              this.fireAuth.auth.currentUser.getIdToken().then((token) => {
                localStorage.setItem('token', token);
                this.router.navigateByUrl('admin/agentes');
              });
          }, (error) => {
            const erro = error.error;
            console.log(erro);
            if (typeof erro.message !==  'undefined') {
              this.authValidation.username = true;
              }
              if (erro.message === 'Senha incorreta') {
                this.authValidation.password = true;
              }
            }
          )
        }
  }

}
