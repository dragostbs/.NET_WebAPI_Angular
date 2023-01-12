import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '../services/auth-api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  constructor(private auth: AuthApiService, private router: Router) {}

  ngOnInit(): void {}

  logOut() {
    this.auth.logoutUser();
    this.router.navigate(['/login']);
  }
}
