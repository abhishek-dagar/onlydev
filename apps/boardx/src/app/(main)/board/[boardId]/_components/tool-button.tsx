"use client";

import Hint from "@repo/ui/components/common/hint";
import { Button } from "@repo/ui/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  count?: number;
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
  count,
}: ToolButtonProps) => {
  return (
    <Hint label={label} side="top" sideOffset={10}>
      <Button
        disabled={isDisabled}
        onClick={onClick}
        size={"icon"}
        variant={isActive ? "boardActive" : "board"}
        className="h-7 w-7 relative"
      >
        <Icon size={16} />
        {count!==undefined && <span className="absolute top-0 right-0 text-[8px] text-muted-foreground">{count}</span>}
      </Button>
    </Hint>
  );
};
