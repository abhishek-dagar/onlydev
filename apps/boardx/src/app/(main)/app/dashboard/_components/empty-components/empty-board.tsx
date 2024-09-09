"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const EmptyBoard = ({ createBoard }: { createBoard: () => void }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src={"/note.svg"} alt="Empty" height={110} width={110} />
      <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a board for you organization
      </p>
      <div className="mt-6">
        <Button size="lg" onClick={createBoard}>
          {/* {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />} */}
          Create board
        </Button>
      </div>
    </div>
  );
};

export default EmptyBoard;
