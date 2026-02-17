import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Table = ({ children, className = "" }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full ${className}`}>
        {children}
      </table>
    </div>
  );
};

export default Table;
