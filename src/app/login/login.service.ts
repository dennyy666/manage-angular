import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../auth/user.model';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  // 登录
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.get<LoginResponse>('assets/user-login/login.json');
  }

}
