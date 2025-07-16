import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;