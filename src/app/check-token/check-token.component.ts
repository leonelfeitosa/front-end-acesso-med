import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-check-token',
  templateUrl: './check-token.component.html',
  styleUrls: ['./check-token.component.scss']
})
export class CheckTokenComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.authService.checkToken().subscribe(() => {
      this.router.navigateByUrl('/admin/agentes');
    }, () => {
      this.router.navigateByUrl('/auth/login')
    })
  }

}
