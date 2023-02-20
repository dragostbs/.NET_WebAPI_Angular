import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface IUser {
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  loggedUser: IUser = {
    username: '',
    email: '',
  };

  readonly financialsAPIUrl = 'https://localhost:44398/api/IdentityUser';

  constructor(private http: HttpClient) {}

  // Login & Register
  loginUser(data: any): Observable<IUser> {
    return this.http.post(this.financialsAPIUrl + '/login', data).pipe(
      map((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);

        this.loggedUser.username = res.username;
        this.loggedUser.email = res.email;

        return this.loggedUser;
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
