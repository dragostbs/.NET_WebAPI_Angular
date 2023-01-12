import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  readonly financialsAPIUrl = 'https://localhost:44398/api/IdentityUser';

  constructor(private http: HttpClient) {}

  // Login & Register
  loginUser(data: any) {
    return this.http.post(this.financialsAPIUrl + '/login', data).pipe(
      map((res: any) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  logoutUser() {
    localStorage.removeItem('token');
  }

  registerUser(data: any) {
    return this.http.post(this.financialsAPIUrl + '/register', data);
  }
}
