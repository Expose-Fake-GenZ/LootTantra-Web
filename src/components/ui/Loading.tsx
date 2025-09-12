import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function Loading({
  size = "md",
  text,
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="text-center">
        <Loader2
          className={cn(
            "text-primary-red animate-spin mx-auto mb-2",
            sizeClasses[size],
          )}
        />
        {text && (
          <p className={cn("text-primary-black-light", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
