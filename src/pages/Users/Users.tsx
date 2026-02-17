import { useEffect, useState } from "react";
import type { User } from "../../features/users/user.types";
import { getUsers } from "../../features/users/user.api";

import UserTable from "../../features/users/UserTable";
import UserModal from "../../features/users/UserModal";

import ConfirmDialog from "../../components/common/ConfirmDialog";
import Loader from "../../components/common/Loader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import useDebounce from "../../hooks/useDebounce";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  // ADD or UPDATE
  const handleSaveUser = (user: User) => {
    setUsers((prev) => {
      const exists = prev.find((u) => u.id === user.id);

      if (exists) {
        // UPDATE
        return prev.map((u) =>
          u.id === user.id ? user : u
        );
      }

      // ADD
      return [...prev, user];
    });
  };

  const handleDeleteClick = (id: number) => {
    setSelectedUserId(id);
  };

  const confirmDelete = () => {
    if (selectedUserId !== null) {
      setUsers((prev) =>
        prev.filter((u) => u.id !== selectedUserId)
      );
      setSelectedUserId(null);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
  <div className="p-8 bg-gray-50 min-h-screen">

    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Users
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and control your users
        </p>
      </div>

      <Button
        onClick={() => {
          setEditingUser(null);
          setIsModalOpen(true);
        }}
        className="shadow-sm"
      >
        + Add User
      </Button>
    </div>

    {/* Search */}
    <div className="mb-6 max-w-md">
      <Input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Table Card */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
      <UserTable
        users={filteredUsers}
        onDelete={handleDeleteClick}
        onEdit={handleEditClick}
      />
    </div>

    <UserModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setEditingUser(null);
      }}
      onSave={handleSaveUser}
      initialData={editingUser}
    />

    <ConfirmDialog
      isOpen={selectedUserId !== null}
      onClose={() => setSelectedUserId(null)}
      onConfirm={confirmDelete}
      message="Are you sure you want to delete this user?"
    />
  </div>
);

};

export default Users;
