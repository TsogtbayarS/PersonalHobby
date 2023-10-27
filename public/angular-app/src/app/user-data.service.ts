import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from 'src/environments/environment.development';
import { MyToken } from './mytoken.service';
import { User } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  baseUrl: string = environment.apiEndpoint;
  jwt: JwtHelperService = new JwtHelperService();
  public get isLoggedIn(): boolean {
    if (localStorage.getItem(environment.token) !== null) {

      return true;
    }
    else {
      return false;
    }
  }
  public get name(): string {
    return this.name;
  }
  public setToken(token: MyToken): void {
    localStorage.setItem(environment.token, token.token);
  }

  public get user(): User | null {
    const token = localStorage.getItem(environment.token);
    if (token !== null) {
      const decodedToken = this.jwt.decodeToken<User>(token);
      return decodedToken;
    } else {
      return null;
    }
  }

  public clearToken(): void {
    localStorage.clear()
  }
  constructor(private http: HttpClient) { }

  public register(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + environment.slashUser + environment.slashRegister, user);
  }

  public login(user: User): Observable<MyToken> {
    return this.http.post<MyToken>(this.baseUrl + environment.slashUser + environment.slashLogin, user)
  }
}
