import { Separator } from "@repo/ui/components/ui/separator";
import { cn } from "@repo/ui/lib/utils";
import React from "react";

interface SettingsSubSectionProps {
  heading?: string;
  subheading?: string;
  className?: string;
  children?: React.ReactNode;
}
const SettingsSubSection = ({
  heading,
  subheading,
  className,
  children,
}: SettingsSubSectionProps) => {
  return (
    <div className={cn("w-2/3 flex flex-col px-4 ", className)}>
      {heading && <h1 className="text-3xl flex gap-2 items-end">{heading}</h1>}
      {subheading && <p className="text-muted-foreground">{subheading}</p>}
      {children}
      <Separator className="mt-2" />
    </div>
  );
};

export default SettingsSubSection;
