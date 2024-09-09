import { useSocket } from "@/context/SocketProvider";
import {
  acceptInvitation,
  fetchInvitations,
  removeInvitation,
} from "@/lib/actions/board-workspace.action";
import { InvitationType } from "@/lib/types/invitation.types";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { UserType } from "@repo/ui/lib/types/user.types";
import { CheckIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const InvitationModel = ({ user }: { user: UserType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [invitations, setInvitations] = useState<InvitationType[]>([]);
  const [page, setPage] = useState({
    invitePageNumber: 1,
    invitePageRecords: 0,
    invitePageSize: 4,
    totalInvitations: 0,
  });
  const { socket } = useSocket();
  const router = useRouter();

  const getInvitations = async () => {
    router.refresh();
    const invites = await fetchInvitations(
      user.id,
      page.invitePageRecords,
      page.invitePageSize
    );
    if (invites.invitations) {
      setInvitations(invites.invitations as any);
      setPage((prev) => ({
        ...prev,
        totalInvitations: invites.totalInvitations,
      }));
    }
  };

  useEffect(() => {
    if (socket && user.id) {
      socket.emit("connect-notification", { roomId: user.id });
      socket.on("notification", () => {
        getInvitations();
      });
      return () => {
        socket.off("notification");
      };
    }
  }, [user.id, isOpen, socket]);

  useEffect(() => {
    getInvitations();
  }, [user.id, isOpen]);

  const acceptInvite = async (invite: InvitationType) => {
    const res = await acceptInvitation(invite);
    if (res.invitation) {
      socket?.emit("notification", { roomId: res.invitation.fromUserId });
      getInvitations();
      router.refresh();
    }
  };

  const rejectInvite = async (invite: InvitationType) => {
    const res = await removeInvitation(invite.id);
    if (res.invitation) {
      socket?.emit("notification", { roomId: res.invitation.fromUserId });
      getInvitations();
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="relative">
          <span>Invitations</span>
          {invitations.length > 0 && (
            <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col h-[70%] items-start">
        <DialogHeader className="h-10">
          <DialogTitle>Invitations</DialogTitle>
        </DialogHeader>
        <div className="table w-full h-full overflow-auto">
          <div className="table-header-group">
            <div className="table-row text-muted-foreground">
              <div className="table-cell text-left border-b px-2">User</div>
              <div className="hidden sm:table-cell text-center border-b">
                Invited
              </div>
              <div className="table-cell text-left border-b"> </div>
            </div>
          </div>
          <div className="table-row-group">
            {invitations.map((invitation) => (
              <div className="table-row" key={invitation.id}>
                <div className="table-cell p-2">
                  {invitation.fromUser.email}
                </div>
                <div className="hidden sm:table-cell p-2">
                  {new Date(invitation.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2 p-2">
                  <div className="flex gap-2 p-2">
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      className="h-7 w-7 hover:bg-destructive"
                      onClick={() => rejectInvite(invitation)}
                    >
                      <XIcon />
                    </Button>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      className="h-7 w-7 hover:bg-primary"
                      onClick={() => acceptInvite(invitation)}
                    >
                      <CheckIcon />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex justify-between items-center">
          <p className="text-muted-foreground text-sm">
            Displaying {invitations.length} of {page.invitePageRecords}
          </p>
          <div className="flex gap-2 items-center">
            <Button
              variant={"ghost"}
              className="text-muted-foreground"
              disabled={page.invitePageNumber === 1}
              onClick={() =>
                setPage({
                  ...page,
                  invitePageNumber: page.invitePageNumber - 1,
                  invitePageRecords: page.invitePageSize - page.invitePageSize,
                })
              }
            >
              Previous
            </Button>
            <p>{page.invitePageNumber}</p>
            <Button
              variant={"ghost"}
              className="text-muted-foreground"
              disabled={
                page.invitePageNumber * page.invitePageSize >=
                page.totalInvitations
              }
              onClick={() =>
                setPage((prev) => ({
                  ...prev,
                  invitePageNumber: prev.invitePageNumber + 1,
                  invitePageRecords:
                    prev.invitePageRecords + prev.invitePageSize,
                }))
              }
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationModel;
