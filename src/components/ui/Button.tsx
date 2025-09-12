import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border-0";

    const variants = {
      primary:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95",
      secondary:
        "bg-black text-white hover:bg-gray-800 active:bg-gray-900 focus:ring-gray-500 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95",
      outline:
        "border-2 border-gray-800 dark:border-gray-300 text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-600 hover:text-white hover:border-gray-800 dark:hover:border-gray-600 active:bg-gray-900 focus:ring-gray-500 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-colors duration-300",
      ghost:
        "text-gray-700 dark:text-gray-300 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-300 transform hover:scale-105 active:scale-95 transition-colors duration-300",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-md",
      md: "px-4 py-2 text-base rounded-lg",
      lg: "px-6 py-3 text-lg rounded-lg",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
