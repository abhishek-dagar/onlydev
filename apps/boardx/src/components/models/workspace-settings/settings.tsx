import { useSocket } from "@/context/SocketProvider";
import {
  deleteBoardWorkspace,
  updateBoardWorkspace,
} from "@/lib/actions/board-workspace.action";
import DeleteConfirmModal from "@repo/ui/components/common/delete-confirm-modal";
import { Icons } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { BoardWorkspacesType } from "@repo/ui/lib/types/board-workspace.types";
import { cn } from "@repo/ui/lib/utils";
import { PencilLineIcon, WholeWordIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { withRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Settings = ({
  workspace,
  setWorkspace,
  setIsOpen,
}: {
  workspace: BoardWorkspacesType;
  setWorkspace: (workspace: BoardWorkspacesType | undefined) => void;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [name, setName] = useState(workspace.name);
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    setName(workspace.name);
  }, [workspace]);
  const handleDelete = async () => {
    const res = await deleteBoardWorkspace(workspace.id);
    if (res.boardWorkspace) {
      setWorkspace(undefined);
      setIsOpen(false);
      socket?.emit("notification", {
        roomId: res.boardWorkspace.members
          .map((member: any) => member.id)
          .push(res.boardWorkspace.userId),
      });
      router.refresh();
      return {
        success: "Workspace deleted successfully",
        err: undefined,
      };
    }
    return {
      success: undefined,
      err: "Failed to delete workspace",
    };
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    const res = await updateBoardWorkspace({
      id: workspace.id,
      name,
    });
    if (res.boardWorkspace) {
      setWorkspace(res.boardWorkspace);
      router.refresh();
      toast.success("Workspace updated successfully");
    } else {
      toast.error("Failed to update workspace");
    }
    setIsLoading(false);
  };
  return (
    <div className="flex-1 flex flex-col gap-2">
      <h1 className="text-5xl">Settings</h1>
      <h1 className="text-xl text-muted-foreground">Mange workspace here</h1>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-center">
          <span
            className={cn(
              "bg-primary w-16 h-16 rounded-md flex justify-center items-center capitalize text-4xl font-semibold"
            )}
          >
            {workspace?.name[0]}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="name"
            type="text"
            autoCapitalize="none"
            autoComplete="none"
            autoCorrect="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            frontIcon={
              <WholeWordIcon size={14} className="text-muted-foreground" />
            }
            disabled={isLoading}
          />
          <Button className="gap-2" disabled={isLoading} onClick={handleUpdate}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PencilLineIcon size={14} />
            )}
            change
          </Button>
        </div>
      </div>
      <div>
        <DeleteConfirmModal
          onConfirm={handleDelete}
          redirectTo="/app/dashboard"
        />
      </div>
    </div>
  );
};

export default Settings;
