import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export function Button({ variant = "default", className = "", ...props }: ButtonProps) {
  const base =
    "rounded-md px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400",
    outline:
      "border border-gray-400 text-white hover:bg-gray-700 focus:ring-gray-400",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
