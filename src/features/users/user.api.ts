import type { User } from "./user.types";
import { api } from "../../services/api";

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get<any>("/users");
  return res.data?.data || [];
};

export const createUser = async (user: Partial<User>): Promise<User> => {
  const res = await api.post<any>("/users", user);
  return res.data;
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const res = await api.put<any>(`/users/${id}`, user);
  return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};
