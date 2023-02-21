import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IUser, loggedUser } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  user: IUser = loggedUser;

  readonly financialsAPIUrl = 'https://localhost:44398/api/IdentityUser';

  constructor(private http: HttpClient) {}

  // Login & Register
  loginUser(data: any): Observable<IUser> {
    return this.http.post(this.financialsAPIUrl + '/login', data).pipe(
      map((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);

        this.user.username = res.username;
        this.user.email = res.email;

        return this.user;
      })
    );
  }

  registerUser(data: any) {
    return this.http.post(this.financialsAPIUrl + '/register', data);
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      alert('Please log in !');
      return false;
    }
  }

  logoutUser() {
    localStorage.removeItem('token');
  }
}
