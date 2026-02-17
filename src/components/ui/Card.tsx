import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: Props) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl shadow-sm p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
