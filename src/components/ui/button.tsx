import { FC, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: FC<ButtonProps> = ({ children, onClick, className = '' }) => {
  return (
    <button onClick={onClick} className={`bg-blue-500 text-white px-4 py-2 rounded-md ${className}`}>
      {children}
    </button>
  );
};

export default Button;
