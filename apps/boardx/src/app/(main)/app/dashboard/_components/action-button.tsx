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
  const { setTheme, theme } = useTheme();
  const [isLight, setIsLight] = React.useState<boolean | undefined>(false);

  const handleThemeChange = (newMode: string, colorVariant?: string) => {
    const themeArray = theme?.split("-") || ["light"]; // Default to light if theme is undefined
    themeArray[0] = newMode; // Change the first part of the theme (mode: light or dark)
    if (colorVariant) themeArray[1] = colorVariant;
    console.log(themeArray.join("-"));

    setTheme(themeArray.join("-")); // Update theme preserving any additional variants
  };

  React.useEffect(() => {
    setIsLight(theme?.includes("light"));
  }, [theme]);

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
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-2 text-xs text-foreground/70 focus:bg-transparent">
          <span>Theme</span>
          <DropdownMenuShortcut className="opacity-100 border rounded-md">
            <Button
              variant={"ghost"}
              size={"icon"}
              className={cn("h-7 w-10", {
                "bg-primary text-white": isLight,
              })}
              onClick={() => handleThemeChange("light")}
            >
              <SunIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={"ghost"}
              size={"icon"}
              className={cn("h-7 w-10", {
                "bg-primary text-white": !isLight,
              })}
              onClick={() => handleThemeChange("dark", "violet")}
            >
              <MoonIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionButton;
