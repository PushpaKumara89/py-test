import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 💡 Form වැඩ වලට මේක ඕනේ
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Form දත්ත රඳවා ගන්නා Object එක
  credentials = { email: '', password: '' };
  errorMessage: string = '';

  onLogin(): void {
  this.authService.login(this.credentials).subscribe({
    next: (response: any) => {
      // 💡 1. Django එකෙන් එන Token එක localStorage එකේ සේව් කරනවා
      // Django Simple JWT නම් එන්නේ response.access, standard Token Auth නම් response.token
      const token = response.access || response.token;
      localStorage.setItem('token', token);

      // 💡 2. දැන් කෙලින්ම Dashboard එකට හරවා යවනවා
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.errorMessage = 'Login වෙන්න බැරි වුණා මචං. Email/Password වැරදියි.';
    }
  });
}
}