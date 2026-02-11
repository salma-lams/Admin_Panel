import { useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Alice", email: "alice@mail.com", role: "Admin" },
    { id: 2, name: "Bob", email: "bob@mail.com", role: "User" },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Add user
  const handleAdd = () => {
    const newUser: User = {
      id: Date.now(),
      ...form,
    };

    setUsers([...users, newUser]);
    setShowModal(false);

    setForm({ name: "", email: "", role: "" });
  };

  // Delete user
  const handleDelete = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>

                <td>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 space-y-4">
            <h2 className="font-semibold">Add User</h2>

            <input
              className="w-full border p-2 rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Role"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Cancel</button>

              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
