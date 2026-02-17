interface Props {
  message: string;
}

const EmptyState = ({ message }: Props) => {
  return (
    <div className="text-center py-10 text-gray-400">
      {message}
    </div>
  );
};

export default EmptyState;
