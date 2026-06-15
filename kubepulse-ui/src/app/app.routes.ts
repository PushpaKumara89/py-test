import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { DashboardComponent } from './features/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { RegisterComponent } from './features/auth/register/register';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // 💡 මෙන්න මේක වයිල්ඩ්කාඩ් එකට උඩින් තියන්න මචං
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // 🚨 හැමතිස්සෙම මේක ඇරේ එකේ අන්තිම පේළිය විය යුතුමයි!
  { path: '**', redirectTo: '/login' } 
];