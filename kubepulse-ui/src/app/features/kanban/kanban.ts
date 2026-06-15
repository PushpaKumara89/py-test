import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KanbanService } from '../../core/services/kanban';

interface Task {
  id: any;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  project: number;
  assigned_to: number;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css'
  })
export class KanbanComponent implements OnInit {
  private kanbanService = inject(KanbanService);
  
  tasks: Task[] = [];
  projects: any[] = [];         // 💡 Projects ලිස්ට් එක තියාගන්න array එකක්
  currentProject: any = null;    // 💡 දැනට සිලෙක්ට් වෙලා තියෙන project එක
  
  draggedTask: Task | null = null;
  showAddTaskModal = false;
  showAddProjectModal = false;   // 💡 Project Modal එක පාලනය කරන්න

  // New Task Object
  newTask = {
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    project: 1,
    assigned_to: 1
  };

  // 💡 New Project Object (Django payload එකට ගැලපෙන්න හැදුවා)
  newProject = {
    name: '',
    description: '',
    members: [1] // Default පළවෙනි යූසර්ව මෙම්බර් කෙනෙක් කලා
  };

  ngOnInit(): void {
    this.loadProjectsFromServer();
  }

  // 1. 💡 සර්වර් එකෙන් ප්‍රොජෙක්ට්ස් ලිස්ට් එක ගන්නවා (List Project)
  loadProjectsFromServer(): void {
    this.kanbanService.getProjects().subscribe({
      next: (data: any) => {
        this.projects = Array.isArray(data) ? data : (data.results || []);
        if (this.projects.length > 0 && !this.currentProject) {
          this.selectProject(this.projects[0]); // මුලින්ම තියෙන ප්‍රොජෙක්ට් එක Active කරනවා
        }
      },
      error: (err) => console.error('Projects ලෝඩ් කරන්න බැරි වුණා!', err)
    });
  }

  // 2. 💡 සර්වර් එකෙන් Tasks ගන්නවා
  loadTasksFromServer(): void {
    this.kanbanService.getTasks().subscribe({
      next: (data: any) => {
        this.tasks = Array.isArray(data) ? data : (data.results || []);
      },
      error: (err) => console.error('Tasks ලෝඩ් කරන්න බැරි වුණා!', err)
    });
  }

  // 3. 💡 ප්‍රොජෙක්ට් එකක් සිලෙක්ට් කරද්දී ක්‍රියාත්මක වන මෙතඩ් එක
  selectProject(project: any): void {
    this.currentProject = project;
    this.newTask.project = project.id; // අලුත් ටාස්ක් එක වැටෙන්න ඕනේ මේ ප්‍රොජෙක්ට් එකටයි
    this.loadTasksFromServer();        // ටාස්ක් ටික රීලෝඩ් කරනවා
  }

  // 4. 💡 සිලෙක්ට් වෙච්ච ප්‍රොජෙක්ට් එකට සහ ස්ටේටස් එකට විතරක් අදාළව ටාස්ක් ෆිල්ටර් කරනවා
  getTasksByStatus(status: 'TODO' | 'IN_PROGRESS' | 'DONE'): Task[] {
    if (!this.currentProject) return [];
    return this.tasks.filter(task => task.status === status && task.project === this.currentProject.id);
  }

  // 5. 💡 අලුත් ප්‍රොජෙක්ට් එකක් සේව් කිරීම (Add Project)
  addNewProject(): void {
    if (!this.newProject.name.trim()) return;

    this.kanbanService.createProject(this.newProject).subscribe({
      next: (savedProject) => {
        this.loadProjectsFromServer(); // ලිස්ට් එක රීලෝඩ් කරනවා
        this.selectProject(savedProject); // අලුතෙන් හදපු ප්‍රොජෙක්ට් එකට කෙලින්ම මාරු වෙනවා
        this.newProject = { name: '', description: '', members: [1] }; // Reset Form
        this.showAddProjectModal = false;
      },
      error: (err) => console.error('Project එක හදන්න බැරි වුණා මචං!', err)
    });
  }

  // 6. Task එකක් ක්‍රියේට් කිරීම
  addNewTask(): void {
    if (!this.newTask.title.trim()) return;

    this.kanbanService.createTask(this.newTask).subscribe({
      next: () => {
        this.loadTasksFromServer();
        this.newTask = { title: '', description: '', status: 'TODO', priority: 'MEDIUM', project: this.currentProject.id, assigned_to: 1 };
        this.showAddTaskModal = false;
      },
      error: (err) => console.error('Task එක ක්‍රියේට් කරන්න බැරි වුණා!', err)
    });
  }

  onDragStart(task: Task): void {
    this.draggedTask = task;
  }

  onDrop(event: DragEvent, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE'): void {
    event.preventDefault();
    if (this.draggedTask && this.draggedTask.status !== newStatus) {
      const originalStatus = this.draggedTask.status;
      this.draggedTask.status = newStatus;

      this.kanbanService.updateTaskStatus(this.draggedTask.id, newStatus).subscribe({
        next: () => this.loadTasksFromServer(),
        error: (err) => {
          console.error('Status එක වෙනස් කරන්න බැරි වුණා!', err);
          if (this.draggedTask) this.draggedTask.status = originalStatus;
        }
      });
    }
    this.draggedTask = null;
  }
}