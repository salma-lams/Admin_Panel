import type { InputHTMLAttributes } from "react";

const Input = ({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`
        w-full
        px-4 py-2.5
        rounded-xl
        border border-gray-300
        bg-white
        text-gray-800
        placeholder-gray-400
        shadow-sm
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
        focus:border-indigo-500
        transition
        duration-200
        ${className}
      `}
      {...props}
    />
  );
};

export default Input;
