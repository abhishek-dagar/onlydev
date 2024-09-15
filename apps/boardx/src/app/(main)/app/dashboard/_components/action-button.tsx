import React from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Switch } from "@repo/ui/components/ui/switch";
import DeleteConfirmModal from "@repo/ui/components/common/delete-confirm-modal";
import {
  Link2Icon,
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
  MoonIcon,
  PencilIcon,
  SunIcon,
  Trash2Icon,
} from "lucide-react";
import { BoardType } from "@repo/ui/lib/types/bards.type";
import RenameModal from "@/components/models/rename-modal";
import { ThemeModeToggle } from "@/components/common/theme-dropdown";
import { useTheme } from "next-themes";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";

interface ActionsProps {
  board: BoardType;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left" | undefined;
  align?: "start" | "center" | "end" | undefined;
  sideOffset?: number | undefined;
  id: string;
  title: string;
  handleDelete: () => void;
  updateBoardData: (data: BoardType) => void;
}

const ActionButton = ({
  board,
  children,
  side,
  align,
  sideOffset,
  id,
  handleDelete,
  updateBoardData,
}: ActionsProps) => {
  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const handleIsPublic = async (checked: boolean) => {
    updateBoardData({ ...board, isPublic: checked });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="w-60 text-sm"
      >
        <div className="flex items-center justify-between p-3 gap-2 text-xs text-foreground/70">
          <p className="flex items-center">
            {board.isPublic ? (
              <LockKeyholeOpenIcon className="h-4 w-4 mr-2" />
            ) : (
              <LockKeyholeIcon className="h-4 w-4 mr-2" />
            )}
            Public
          </p>
          <DropdownMenuShortcut>
            <Switch
              checked={board.isPublic}
              onCheckedChange={handleIsPublic}
              className="h-4 w-9"
              thumbClassName="h-3 w-3"
            />
          </DropdownMenuShortcut>
        </div>
        <DropdownMenuItem
          onClick={onCopyLink}
          className="p-2 cursor-pointer text-xs text-foreground/70"
        >
          <Link2Icon className="h-4 w-4 mr-2" />
          <span>Copy board link</span>
        </DropdownMenuItem>
        <RenameModal board={board} updateBoardData={updateBoardData}>
          <div className="flex items-center p-2 gap-2 text-xs text-foreground/70 cursor-pointer hover:bg-accent rounded-sm">
            <p className="flex items-center">
              <PencilIcon className="h-4 w-4 mr-2" />
              <span>Rename</span>
            </p>
          </div>
        </RenameModal>
        <DeleteConfirmModal onConfirm={handleDelete}>
          <DropdownMenuItem className="p-2 cursor-pointer text-xs text-foreground/70">
            <Trash2Icon className="h-4 w-4 mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DeleteConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionButton;
