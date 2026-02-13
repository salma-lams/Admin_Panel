import type { User } from "./user.types";

interface Props {
  users: User[];
  onDelete: (id: number) => void;
}

const UserTable = ({ users, onDelete }: Props) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400 text-sm">
            <th className="pb-3">Name</th>
            <th className="pb-3">Email</th>
            <th className="pb-3">Role</th>
            <th className="pb-3">Created</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-700 hover:bg-gray-700 transition"
            >
              <td className="py-3">{user.name}</td>
              <td className="py-3">{user.email}</td>
              <td className="py-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user.role === "admin"
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="py-3">{user.createdAt}</td>
              <td className="py-3">
                <button
                  onClick={() => onDelete(user.id)}
                  className="bg-red-500 px-3 py-1 rounded text-sm hover:opacity-80"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
