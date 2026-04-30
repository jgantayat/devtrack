export interface LogEntry {
  id: string;
  date: string;            // YYYY-MM-DD
  content: string;
  tags: string[];
  mood: number;            // 1-5
  createdAt: string;
}