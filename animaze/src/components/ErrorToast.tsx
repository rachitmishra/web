import React from "react";

interface ErrorToastProps {
  message: string;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message }) => {
  return (
    <div className="error-toast">
      {message}
    </div>
  );
};
