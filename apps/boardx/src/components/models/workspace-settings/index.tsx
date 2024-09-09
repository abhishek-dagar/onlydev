"use client";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { BoardWorkspacesType } from "@repo/ui/lib/types/board-workspace.types";
import React, { useState } from "react";
import SideBar from "./side-bar";
import Settings from "./settings";
import Member from "./member";
import { UserType } from "@repo/ui/lib/types/user.types";
import { useMediaQuery } from "@/components/custom-hooks/media-query";
import { cn } from "@repo/ui/lib/utils";

const WorkspaceSettings = ({
  user,
  workspace,
  setWorkspace,
}: {
  user: UserType;
  workspace: BoardWorkspacesType | undefined;
  setWorkspace: (workspace: BoardWorkspacesType | undefined) => void;
}) => {
  const [tab, setTab] = useState<string>("members");
  const [isOpen, setIsOpen] = useState(false);
  const isTab = useMediaQuery("(max-width: 768px)");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="w-[120px] md:w-full justify-start"
          disabled={!workspace || user.id !== workspace.userId}
        >
          {workspace ? workspace.name : "No workspace"}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn("max-w-[70%] h-[80%] py-0", { "pl-0": isTab })}
      >
        <DialogHeader className="hidden">
          <DialogTitle />
        </DialogHeader>
        <div
          className={cn("w-full h-full flex relative", {
            "overflow-hidden": isTab,
          })}
        >
          <SideBar workspace={workspace} tab={tab} setTab={setTab} />
          <div className={cn("flex-1 py-6 pl-6", { "pt-20": isTab })}>
            {workspace && (
              <>
                {tab === "settings" ? (
                  <Settings
                    workspace={workspace}
                    setWorkspace={setWorkspace}
                    setIsOpen={setIsOpen}
                  />
                ) : (
                  <Member user={user} workspace={workspace} />
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceSettings;
