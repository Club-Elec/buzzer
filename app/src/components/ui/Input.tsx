import { FC, InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: "primary" | "secondary";
};

const Input: FC<InputProps> = ({
  variant = "primary",
  className,
  children,
  ...props
}) => {
  return (
    <input
      className={cn(
        "h-16 px-4 py-2 border rounded-2xl shadow-md text-lg font-semibold text-red-100",
        variant === "primary"
          ? "bg-red-700 border border-red-900 shadow-red-800"
          : "",
        variant === "secondary" ? "bg-red-950/50 border-red-950" : "",
        className
      )}
      {...props}
    >
      {children}
    </input>
  );
};

export default Input;
