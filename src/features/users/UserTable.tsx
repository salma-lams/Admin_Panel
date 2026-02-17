import type { User } from "./user.types";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/common/EmptyState";

interface Props {
  users: User[];
  onDelete: (id: number) => void;
  onEdit: (user: User) => void;
}

const UserTable = ({ users, onDelete, onEdit }: Props) => {
  if (!users.length) {
    return <EmptyState message="No users found." />;
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <Table className="min-w-full text-gray-700">

        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200 text-sm text-gray-600">
            <th className="py-4 px-4 text-left font-semibold">Name</th>
            <th className="py-4 px-4 text-left font-semibold">Email</th>
            <th className="py-4 px-4 text-left font-semibold">Role</th>
            <th className="py-4 px-4 text-left font-semibold">Created</th>
            <th className="py-4 px-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition duration-200"
            >
              <td className="py-4 px-4 font-medium text-gray-800">
                {user.name}
              </td>

              <td className="py-4 px-4 text-gray-600">
                {user.email}
              </td>

              <td className="py-4 px-4">
                <Badge variant={user.role}>
                  {user.role}
                </Badge>
              </td>

              <td className="py-4 px-4 text-gray-500 text-sm">
                {user.createdAt}
              </td>

              <td className="py-4 px-4 flex gap-2">
                <Button
                  variant="edit"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </Button>

                <Button
                  variant="danger"
                  onClick={() => onDelete(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>

      </Table>
    </Card>
  );
};

export default UserTable;
