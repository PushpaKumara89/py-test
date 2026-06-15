import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = { username: '', email: '', password: '' };
  errorMessage = '';

  onRegister(): void {
    this.authService.register(this.user).subscribe({
      next: () => {
        alert('සාර්ථකව ලියාපදිංචි වුණා මචං! දැන් ලොගින් වෙන්න.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'ලියාපදිංචි වෙන්න බැරි වුණා. පොඩ්ඩක් බලන්න.';
      }
    });
  }
}