import { useEffect, useState } from "react";
import type { User } from "./user.types";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  initialData?: User | null;
}

const UserModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
    } else {
      setName("");
      setEmail("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name || !email) return;

    const user: User = {
      id: initialData?.id || Date.now(),
      name,
      email,
      role: initialData?.role || "user",
      createdAt:
        initialData?.createdAt ||
        new Date().toISOString().split("T")[0],
    };

    onSave(user);
    onClose();
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
        className="mb-4"
      />

      <div className="flex justify-end gap-3">
        <Button variant="edit" onClick={onClose}>
          Cancel
        </Button>

        <Button onClick={handleSubmit}>
          {initialData ? "Update" : "Save"}
        </Button>
      </div>
    </Modal>
  );
};

export default UserModal;
