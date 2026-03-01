import { useEffect, useState } from "react";
import type { User } from "./user.types";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => Promise<void> | void;
  initialData?: User | null;
}

const UserModal = ({ isOpen, onClose, onSave, initialData }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<User["role"]>("user");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setRole(initialData.role);
      setActive(initialData.active);
    } else {
      setName("");
      setEmail("");
      setRole("user");
      setActive(true);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!name || !email) return;

    const user: User = {
      id: initialData?.id || Date.now(),
      name,
      email,
      role,
      active,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    setSaving(true);
    try {
      await onSave(user);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">
        {initialData ? "Edit User" : "Add User"}
      </h2>

      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-3"
      />

      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as User["role"])}
        className="mb-3 w-full p-2 border rounded"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Active
      </label>

      <div className="flex justify-end gap-3">
        <Button variant="edit" onClick={onClose}>
          Cancel
        </Button>

        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : initialData ? "Update" : "Save"}
        </Button>
      </div>
    </Modal>
  );
};

export default UserModal;
