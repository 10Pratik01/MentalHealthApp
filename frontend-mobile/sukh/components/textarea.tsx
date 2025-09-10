import React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full rounded-md p-3 border border-gray-500 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400 ${className}`}
      {...props}
    />
  );
}
