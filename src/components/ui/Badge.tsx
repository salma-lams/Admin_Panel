interface Props {
  children: React.ReactNode;
  variant?: "admin" | "user";
}

const Badge = ({ children, variant = "user" }: Props) => {
  const styles =
    variant === "admin"
      ? "bg-yellow-500 text-black"
      : "bg-gray-600 text-white";

  return (
    <span className={`px-2 py-1 rounded text-xs ${styles}`}>
      {children}
    </span>
  );
};

export default Badge;
