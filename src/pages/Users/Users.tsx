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

  const handleSaveUser = (user: User) => {
    setUsers((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      if (exists) {
        return prev.map((u) =>
          u.id === user.id ? user : u
        );
      }
      return [...prev, user];
    });
  };

  const confirmDelete = () => {
    if (selectedUserId !== null) {
      setUsers((prev) =>
        prev.filter((u) => u.id !== selectedUserId)
      );
      setSelectedUserId(null);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              User Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage roles, access and user accounts
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
          >
            + New User
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {users.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {users.filter(u => u.active).length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-sm text-gray-500">Admins</p>
            <p className="text-3xl font-bold text-red-500 mt-2">
              {users.filter(u => u.role === "admin").length}
            </p>
          </div>

        </div>

        {/* Search + Table */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No users found.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <UserTable
                users={filteredUsers}
                onDelete={(id) => setSelectedUserId(id)}
                onEdit={(user) => {
                  setEditingUser(user);
                  setIsModalOpen(true);
                }}
              />
            </div>
          )}

        </div>

      </div>

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        initialData={editingUser}
      />

      {/* Confirm */}
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
