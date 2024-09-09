"use client";
import Logo from "@/components/Logo";
import WorkspaceSettings from "@/components/models/workspace-settings";
import { fetchBoardWorkspaceById } from "@/lib/actions/board-workspace.action";
import { Button } from "@repo/ui/components/ui/button";
import { BoardWorkspacesType } from "@repo/ui/lib/types/board-workspace.types";
import { UserType } from "@repo/ui/lib/types/user.types";
import { cn } from "@repo/ui/lib/utils";
import { LayoutDashboardIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const SubSidebar = ({user}: {user: UserType}) => {
  const searchParams = useSearchParams();
  const [workspace, setWorkspace] = React.useState<
    BoardWorkspacesType | undefined
  >();
  useEffect(() => {
    const getWorkspace = async () => {
      if (searchParams.get("workspaceId")) {
        const { boardWorkspace } = await fetchBoardWorkspaceById(
          searchParams.get("workspaceId")!
        );
        if (boardWorkspace) setWorkspace(boardWorkspace as BoardWorkspacesType);
      }
    };
    getWorkspace();
  }, [searchParams, searchParams.get("workspaceId")]);
  return (
    <div className="hidden w-1/5 border-r h-screen py-6 md:flex flex-col items-center gap-3">
      <div className="flex flex-col justify-center items-center">
        <Logo className="animate-pulse duration-700" />
        <p className="text-sm text-muted-foreground">{`owner: ${workspace?.user?.name ? workspace?.user?.name : workspace?.user?.email.split("@")[0]}`}</p>
      </div>
      <div className="flex justify-center items-center px-3 w-full">
        <WorkspaceSettings user={user} workspace={workspace} setWorkspace={setWorkspace} />
      </div>
      <div className="flex flex-col justify-center items-center px-3 w-full gap-2">
        <Button
          variant={"ghost"}
          className={cn("w-full justify-start gap-3", {
            "bg-muted/60": !searchParams.get("favorite"),
          })}
          asChild
        >
          <Link
            href={`/app/dashboard?workspaceId=${searchParams.get("workspaceId")}`}
          >
            <LayoutDashboardIcon size={16} />
            Boards
          </Link>
        </Button>
        <Button
          variant={"ghost"}
          className={cn("w-full justify-start gap-3", {
            "bg-muted/60": searchParams.get("favorite") === "true",
          })}
          asChild
        >
          <Link
            href={`/app/dashboard?workspaceId=${searchParams.get("workspaceId")}&favorite=true`}
          >
            <StarIcon size={16} />
            Favorites
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SubSidebar;
