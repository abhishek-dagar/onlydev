"use client";
import { LoaderIcon } from "lucide-react";
import { InfoSkeleton } from "../info";
import { ParticipantsSkeleton } from "../participants";
import { ToolbarSkeleton } from "../toolbar";

export const Loading = () => {
  return (
    <main className="h-screen w-screen relative touch-none flex items-center justify-center">
      <LoaderIcon className="h-6 w-6 text-muted-foreground animate-spin" />
      <InfoSkeleton />
      <ParticipantsSkeleton />
      <ToolbarSkeleton />
    </main>
  );
};
