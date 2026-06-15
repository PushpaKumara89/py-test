import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 💡 1. URL එක Register හෝ Login නම්, කිසිම චෙක් එකක් නොකර කෙලින්ම Request එක යවන්න
  if (req.url.includes('/api/auth/register/') || req.url.includes('/api/auth/login/')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

  // 💡 2. ටෝකන් එකක් තියෙනවාද වගේම ඒක "null"/"undefined" ස්ට්‍රින්ග්ස් නෙවෙයිද කියලා ඩබල් චෙක් කරනවා
  if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};