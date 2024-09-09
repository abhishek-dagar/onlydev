"use client";
import AddBoardModel from "@/components/models/add-board-model";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { BoardWorkspacesType } from "@repo/ui/lib/types/board-workspace.types";
import { UserType } from "@repo/ui/lib/types/user.types";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./index.css";
import { useSearchParams } from "next/navigation";
import { cn } from "@repo/ui/lib/utils";
import { fetchBoardWorkspaces } from "@/lib/actions/board-workspace.action";

const SideBar = ({ user }: { user: UserType }) => {
  const [boardWorkspaces, setBoardWorkspaces] = useState<BoardWorkspacesType[]>(
    []
  );
  const searchParams = useSearchParams();

  const addWorkspace = (newWorkspace: BoardWorkspacesType) => {
    setBoardWorkspaces([...boardWorkspaces, newWorkspace]);
  };
  const getBoardWorkspaces = async () => {
    if (user) {
      const res = await fetchBoardWorkspaces(user.id);
      if (res.boardWorkspaces)
        setBoardWorkspaces(res.boardWorkspaces as BoardWorkspacesType[]);
    }
  };
  useEffect(() => {
    getBoardWorkspaces();
  }, [user.id]);
  return (
    <nav className="h-screen overflow-auto justify-between flex items-center flex-col gap-10 px-2 min-w-16 w-16 border-r relative no-slide-bar">
      <div className="flex items-center justify-center flex-col gap-8">
        <ul className="flex items-start justify-center flex-col gap-3 py-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <li className="sticky top-0 bg-background">
                  <AddBoardModel user={user} addWorkspace={addWorkspace} />
                </li>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={10}
                className="bg-black/10 backdrop-blur-xl"
              >
                <p>Add Board</p>
              </TooltipContent>
            </Tooltip>
            {boardWorkspaces?.map((workspace) => (
              <Tooltip delayDuration={0} key={workspace.id}>
                <TooltipTrigger>
                  <Link href={`/app/dashboard?workspaceId=${workspace.id}`}>
                    <li
                      className={cn(
                        "bg-secondary w-10 h-10 rounded-md flex justify-center items-center capitalize text-lg font-bold",
                        {
                          "bg-primary text-primary-foreground":
                            workspace.id === searchParams.get("workspaceId"),
                        }
                      )}
                    >
                      {workspace.name[0]}
                    </li>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={10}
                  className="bg-black/10 backdrop-blur-xl"
                >
                  <p>{workspace.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </ul>
      </div>
    </nav>
  );
};

export default SideBar;
