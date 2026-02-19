export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  active: boolean;       // ⚡ must exist
  createdAt: string;     // ISO date string
}
