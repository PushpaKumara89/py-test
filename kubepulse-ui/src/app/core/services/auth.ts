import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/auth`;

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token); // Token එක සේව් කරගත්තා
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    // 💡 localStorage එකේ 'token' එකක් තියෙනවා නම් true දෙනවා, නැත්නම් false
    return !!localStorage.getItem('token');
  }

  // auth.service.ts එකේ ඉන්න පරණ මෙතඩ් වලට පහලින් මේක දාන්න
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register/`, userData);
  }
}