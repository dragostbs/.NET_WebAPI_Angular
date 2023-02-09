import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/services/auth-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onLogIn() {
    if (this.loginForm.valid) {
      this.auth.loginUser(this.loginForm.value).subscribe({
        next: (res) => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.loginForm.reset();
          alert('Username or Password Invalid !');
          console.log(err);
        },
      });
    }
  }
}
