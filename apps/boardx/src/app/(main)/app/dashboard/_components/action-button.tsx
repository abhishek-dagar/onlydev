import React from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Switch } from "@repo/ui/components/ui/switch";
import DeleteConfirmModal from "@repo/ui/components/common/delete-confirm-modal";
import {
  Link2Icon,
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { BoardType } from "@repo/ui/lib/types/bards.type";
import RenameModal from "@/components/models/rename-modal";

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
        <div className="flex items-center justify-between p-3">
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
        <DropdownMenuItem onClick={onCopyLink} className="p-3 cursor-pointer">
          <Link2Icon className="h-4 w-4 mr-2" />
          Copy board link
        </DropdownMenuItem>
        <DropdownMenuItem className="p-3 cursor-pointer" asChild>
          <RenameModal board={board} updateBoardData={updateBoardData} />
        </DropdownMenuItem>
        <DeleteConfirmModal onConfirm={handleDelete}>
          <Button
            variant={"ghost"}
            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
          >
            <Trash2Icon className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </DeleteConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionButton;
