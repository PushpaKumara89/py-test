import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {
  private http = inject(HttpClient);
  // 💡 ඔයාගේ Django Tasks API URL එක මෙතනට දෙන්න මචං (අගට / අමතක කරන්න එපා)
  private apiUrl = `${environment.apiUrl}/api/tasks/`;

  // localStorage එකෙන් ටෝකන් එක අරන් Header එක සෙට් කරන මෙතඩ් එකක්
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      // 💡 Django Simple JWT නම් 'Bearer ', සාමාන්‍ය TokenAuth නම් 'Token ' කියලා දාන්න මචං
      'Authorization': `Bearer ${token}`
    });
  }

  // 1. Backend එකෙන් සේරම Tasks ටික ගෙන්නා ගැනීම
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // 💡 පැරාමීටර් එකේ ටයිප් එක 'TODO' | 'IN_PROGRESS' | 'DONE' විදිහට අප්ඩේට් කරන්න
  updateTaskStatus(id: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE'): Observable<any> {
    // Django REST Framework එකේ Single Object එකක් අප්ඩේට් කරන්නේ /api/tasks/id/ කියන URL එකටයි
    return this.http.patch<any>(`${this.apiUrl}${id}/`, { status }, { headers: this.getAuthHeaders() });
  }

  // 💡 අලුත් Task එකක් Django DB එකට එකතු කිරීම
  createTask(taskData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, taskData, { headers: this.getAuthHeaders() });
  }

  getProjects(): Observable<any> {
    // 💡 ප්‍රොජෙක්ට්ස් ලිස්ට් එක backend එකෙන් ගන්නවා
    return this.http.get<any>(`http://127.0.0.1:8000/api/projects/`, { headers: this.getAuthHeaders() });
  }
  // 💡 අලුත් ප්‍රොජෙක්ට් එකක් ඩේටාබේස් එකට සේව් කරන්න
  createProject(projectData: any): Observable<any> {
    return this.http.post<any>(`http://127.0.0.1:8000/api/projects/`, projectData, { headers: this.getAuthHeaders() });
  }
}