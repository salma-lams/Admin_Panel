import type { User } from "./user.types";
import { api } from "../../services/api";

export const getUsers = async (): Promise<User[]> => api.get<User[]>("/users");

export const createUser = async (user: Partial<User>): Promise<User> =>
  api.post<User>("/users", user);

export const updateUser = async (id: number, user: Partial<User>): Promise<User> =>
  api.put<User>(`/users/${id}`, user);

export const deleteUser = async (id: number): Promise<void> =>
  api.delete(`/users/${id}`);
