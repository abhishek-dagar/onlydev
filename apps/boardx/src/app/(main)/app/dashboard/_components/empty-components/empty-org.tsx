import AddBoardModel from "@/components/models/add-board-model";
import { Button } from "@repo/ui/components/ui/button";
import Image from "next/image";
import React from "react";

const EmptyOrg = ({ user }: { user: any }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src={"/elements.svg"} alt="Empty" height={200} width={200} />
      <h2 className="text-2xl font-semibold mt-6">Welcome to BoardX</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Create an workspace to get started
      </p>
      <div className="mt-6">
        <AddBoardModel user={user}>
          <Button size={"lg"}>Create Workspace</Button>
        </AddBoardModel>
      </div>
    </div>
  );
};

export default EmptyOrg;
