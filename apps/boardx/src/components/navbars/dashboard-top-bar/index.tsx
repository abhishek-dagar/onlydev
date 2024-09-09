"use client";

import { UserType } from "@repo/ui/lib/types/user.types";
import UserButton from "@repo/ui/components/buttons/user-button/index";
import { Input } from "@repo/ui/components/ui/input";
import { SearchIcon } from "lucide-react";
import WorkspaceSettings from "@/components/models/workspace-settings";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { BoardWorkspacesType } from "@repo/ui/lib/types/board-workspace.types";
import { fetchBoardWorkspaceById } from "@/lib/actions/board-workspace.action";
import { useMediaQuery } from "@/components/custom-hooks/media-query";
import InvitationModel from "@/components/models/invitations-model";
import { ThemeModeToggle } from "@/components/common/theme-dropdown";

const DashboardTopBar = ({
  user,
  searchQuery,
  setSearchQuery,
}: {
  user: UserType;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) => {
  const searchParams = useSearchParams();
  const [workspace, setWorkspace] = React.useState<
    BoardWorkspacesType | undefined
  >();
  const isMobile = useMediaQuery("(max-width: 769px)");
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
    <div className="flex items-center justify-between py-3 px-5">
      {isMobile ? (
        <WorkspaceSettings
          user={user}
          workspace={workspace}
          setWorkspace={setWorkspace}
        />
      ) : (
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          frontIcon={<SearchIcon size={14} className="text-muted-foreground" />}
          className="w-[320px]"
        />
      )}
      <div className="flex gap-4 items-center">
        <ThemeModeToggle />
        <InvitationModel user={user} />
        <UserButton
          user={user}
          isCheckOnline={false}
          settingPageLink="/app/user/profile"
        />
      </div>
    </div>
  );
};

export default DashboardTopBar;
