import { useState } from "react";
import type { User } from "./user.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: User) => void;
}

const UserModal = ({ isOpen, onClose, onAdd }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name || !email) return;

    const newUser: User = {
      id: Date.now(),
      name,
      email,
      role: "user",
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAdd(newUser);
    setName("");
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add User</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-yellow-500 text-black rounded font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
