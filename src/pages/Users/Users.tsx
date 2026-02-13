import { useEffect, useState } from "react";
import type { User } from "../../features/users/user.types";
import { getUsers } from "../../features/users/user.api";
import UserTable from "../../features/users/UserTable";
import UserModal from "../../features/users/UserModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleAddUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedUserId(id);
  };

  const confirmDelete = () => {
    if (selectedUserId !== null) {
      setUsers((prev) => prev.filter((u) => u.id !== selectedUserId));
      setSelectedUserId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90"
        >
          + Add User
        </button>
      </div>

      <UserTable users={users} onDelete={handleDeleteClick} />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddUser}
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
