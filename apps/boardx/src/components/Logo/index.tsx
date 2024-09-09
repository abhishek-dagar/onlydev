import React from "react";
import Link from "next/link";
import { ClipboardListIcon } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

interface Props {
  isSmall?: boolean;
  className?: string;
  to?: string;
}
const Logo = ({ className, isSmall = false, to = "/" }: Props) => {
  return (
    <Link
      href={to}
      className={cn(
        "flex items-center text-[20px] md:text-[28px] font-bold cursor-pointer select-none",
        className
      )}
    >
      <ClipboardListIcon className="text-[#f69220]" />
      {!isSmall && (
        <>
          <p>Board</p>
          <p className="text-[#f69220]">X</p>
        </>
      )}
    </Link>
  );
};

export default Logo;
