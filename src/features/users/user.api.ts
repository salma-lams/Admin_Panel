import type { User } from "./user.types";

const fakeUsers: User[] = [
  {
    id: 1,
    name: "Salma Lamsaaf",
    email: "salma@gmail.com",
    role: "admin",
    createdAt: "2026-01-01",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@gmail.com",
    role: "user",
    createdAt: "2026-01-05",
  },
];

export const getUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fakeUsers), 500);
  });
};
