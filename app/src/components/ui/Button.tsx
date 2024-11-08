import { FC, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const Button: FC<ButtonProps> = ({
  variant = "primary",
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        "h-16 px-4 py-2 border rounded-2xl shadow-md text-red-100 text-lg font-semibold active:scale-95 transition ease-in-out duration-300",
        variant === "primary" ? "bg-red-700 border-red-900 shadow-red-800" : "",
        variant === "secondary" ? "bg-red-950/50 border-red-950" : "",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
