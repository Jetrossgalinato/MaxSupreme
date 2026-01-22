export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';

export interface Task {
  id: string;
  created_at: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  start_date: string | null;
  end_date: string | null;
  milestone: string | null;
  notes: string | null;
  assigned_to: string | null;
}
