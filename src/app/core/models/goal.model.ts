export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  progress: number;        // 0-100
  rating: number;          // 0-5
  deadline?: string;
  completed: boolean;
  createdAt: string;
}