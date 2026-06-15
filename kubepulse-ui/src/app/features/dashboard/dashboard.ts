import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { KanbanComponent } from '../kanban/kanban'; // 💡 මෙන්න මේක import කරන්න

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [KanbanComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }
}