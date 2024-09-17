import { useMediaQuery } from "@/components/custom-hooks/media-query";
import useClickOutside from "@/components/custom-hooks/use-click-outside";
import Settings from "@repo/ui/components/icons/settings";
import UserRound from "@repo/ui/components/icons/user-round";
import { Button } from "@repo/ui/components/ui/button";
import { BoardWorkspacesType } from "@repo/ui/lib/types/board-workspace.types";
import { cn } from "@repo/ui/lib/utils";
import { MenuIcon } from "lucide-react";
import { useRef, useState } from "react";

const SideBar = ({
  workspace,
  tab,
  setTab,
}: {
  workspace: BoardWorkspacesType | undefined;
  tab: string;
  setTab: (tab: string) => void;
}) => {
  const isTab = useMediaQuery("(max-width: 768px)");
  const sideBarRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  useClickOutside(sideBarRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });
  return (
    <>
      <Button
        variant={"ghost"}
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-3 top-6 items-center gap-2 hidden md:flex"
      >
        <MenuIcon size={20} /> Menu
      </Button>
      <div
        ref={sideBarRef}
        className={cn("w-[200px] border-r py-6 pr-6 flex flex-col gap-4", {
          "absolute left-0 pl-6 top-0 bg-background h-full shadow-foreground shadow-md":
            isTab,
          "hidden slide-out-to-right animate-out duration-300":
            !isOpen && isTab,
          "slide-in-from-left animate-in duration-200 z-[100]": isOpen && isTab,
        })}
      >
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "bg-primary w-7 h-7 rounded-md flex justify-center items-center capitalize text-lg font-semibold"
            )}
          >
            {workspace?.name[0]}
          </span>
          <span className="text-md font-semibold">{workspace?.name}</span>
        </div>
        <div className="flex flex-col">
          <Button
            variant={"ghost"}
            className={cn("w-full justify-start mt-2 p-0 cursor-pointer", {
              "bg-secondary/70": tab === "members",
            })}
            onClick={() => setTab("members")}
            asChild
          >
            <p className="flex items-center gap-2 w-full px-4">
              <UserRound selected={tab === "members"} />
              <span>Members</span>
            </p>
          </Button>
          <Button
            variant={"ghost"}
            className={cn("w-full justify-start mt-2 p-0 cursor-pointer", {
              "bg-secondary/70": tab === "settings",
            })}
            onClick={() => setTab("settings")}
            asChild
          >
            <p className="flex items-center gap-2 w-full px-4">
              <Settings selected={tab === "settings"} />
              <span>Settings</span>
            </p>
          </Button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
