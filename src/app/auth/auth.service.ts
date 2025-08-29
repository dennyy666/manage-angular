import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { User, LoginResponse } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 使用 BehaviorSubject 存储当前用户状态
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  // 存储 Token 的 Key（用于 localStorage）
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {
    // 初始化时尝试从 localStorage 恢复用户状态
    this.initializeAuthState();
  }

  // 初始化认证状态（如页面刷新后恢复登录态）
  private initializeAuthState(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      // 如果有 Token，模拟获取用户信息（实际项目中可能需要调用 API）
      const index = Number.parseInt(token.slice(-1))
      if ([0, 1].includes(index)) {
        this.fetchCurrentUser(index).subscribe({
          error: () => this.clearAuthState() // Token 无效时清理
        });
      }
    }
  }

  // 保存用户信息和Token
  setAuthentication(user: User) {
    this.currentUserSubject.next(user);
    localStorage.setItem(this.TOKEN_KEY, user.token);
  }

  // 退出登录
  logout(): void {
    this.clearAuthState();
  }

  // 获取当前用户信息（模拟或调用 API）
  private fetchCurrentUser(index: number): Observable<LoginResponse> {
    return this.http.get<LoginResponse>('assets/user-login/login.json').pipe(
      tap(response => {
        const user = response.data[index];
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        this.clearAuthState();
        return throwError(() => error);
      })
    );
  }

  // 清理认证状态
  private clearAuthState(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // 获取当前 Token（用于 HTTP 拦截器）
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

}
