import { useSocket } from "@/context/SocketProvider";
import {
  fetchInvitedMembers,
  fetchWorkspaceMembers,
  inviteMemberToBoardWorkspace,
  removeInvitation,
  removeMemberFromBoardWorkspace,
} from "@/lib/actions/board-workspace.action";
import { InvitationType } from "@/lib/types/invitation.types";
import { UserRoundIcon } from "@repo/ui/components/icons/user-round";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { BoardWorkspacesType } from "@repo/ui/lib/types/board-workspace.types";
import { UserType } from "@repo/ui/lib/types/user.types";
import { cn } from "@repo/ui/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Member = ({
  user,
  workspace,
}: {
  user: UserType;
  workspace: BoardWorkspacesType;
}) => {
  const [tab, setTab] = useState("members");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [invitedMembers, setInvitedMembers] = useState<InvitationType[]>([]);
  const [members, setMembers] = useState<UserType[]>([]);
  const [page, setPage] = useState({
    invitePageNumber: 1,
    invitePageRecords: 0,
    invitePageSize: 4,
    totalInvitedMembers: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit("connect-notification", { roomId: user.id });
      socket.on("notification", (data) => {
        getInvitedMembers();
        getMembers();
      });
      return () => {
        socket.off("notification");
      }
    }
  }, [user, socket]);

  const getInvitedMembers = async () => {
    const res = await fetchInvitedMembers(
      user.id,
      workspace.id,
      page.invitePageRecords,
      page.invitePageSize
    );
    if (res.invitations) {
      setInvitedMembers(res.invitations as any);

      setPage((prev) => ({
        ...prev,
        totalInvitedMembers: res.totalInvitations,
      }));
    }
  };

  const getMembers = async () => {
    const res = await fetchWorkspaceMembers(workspace.id, 0, 0);
    if (res.members) {
      setMembers(res.members as any);
    } else {
      setMembers([]);
    }
  };
  useEffect(() => {
    getInvitedMembers();
    getMembers();
  }, [user, workspace, page.invitePageNumber, page.invitePageSize]);

  const inviteMember = async () => {
    const res = await inviteMemberToBoardWorkspace({
      email,
      fromUserId: user.id,
      BoardWorkSpaceId: workspace.id,
    });
    if (res.err) {
      setError(res.err);
      toast.error(res.err);
    } else if (res.invitation) {
      socket?.emit("notification", { roomId: res.invitation.toUserId });
      setEmail("");
      setError(null);
      getInvitedMembers();
      toast.success("Member invited successfully");
    }
  };

  const revokeInvitation = async (id: string) => {
    setIsLoading(true);
    const res = await removeInvitation(id);
    if (res.err) {
      toast.error(res.err);
    } else if (res.invitation) {
      getInvitedMembers();
      socket?.emit("notification", { roomId: res.invitation.toUserId });
      toast.success("Invitation revoked successfully");
    }
    setIsLoading(false);
  };

  const removeMember = async (id: string) => {
    setIsLoading(true);
    const res = await removeMemberFromBoardWorkspace({
      memberId: id,
      boardWorkspaceId: workspace.id,
    });
    if (res.member) {
      socket?.emit("notification", { roomId: id });
      getMembers();
      toast.success("Member removed successfully");
    } else {
      toast.error(res.err);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col gap-2">
      <h1 className="text-5xl">Members</h1>
      <h1 className="text-xl text-muted-foreground">
        View and manage workspace members
      </h1>
      <div className="border-b mb-4">
        <Button
          variant={"ghost"}
          className={cn("rounded-b-none", {
            "border-b-2 border-primary": tab === "members",
          })}
          onClick={() => setTab("members")}
        >
          Members
        </Button>
        <Button
          variant={"ghost"}
          className={cn("rounded-b-none", {
            "border-b-2 border-primary": tab === "invitations",
          })}
          onClick={() => setTab("invitations")}
        >
          Invitations
        </Button>
      </div>
      {tab === "members" ? (
        <div>
          <div className="table w-full">
            <div className="table-header-group">
              <div className="table-row text-muted-foreground">
                <div className="table-cell text-left border-b px-2">User</div>
                <div className="table-cell text-center border-b px-2">name</div>
                <div className="table-cell text-left border-b"> </div>
              </div>
            </div>
            <div className="table-row-group">
              {members.map((member) => (
                <div className="table-row" key={member.id}>
                  <div className="table-cell w-full p-2">{member.email}</div>
                  <div className="table-cell text-center p-2">
                    {member.name || "Unknown"}
                  </div>
                  <div className="flex gap-2 p-2 w-[120px] justify-end">
                    <Button
                      variant={"outline"}
                      className="h-7 hover:bg-destructive"
                      disabled={isLoading}
                      onClick={() => removeMember(member.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">
              Displaying {invitedMembers.length} of {page.invitePageRecords}
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
                    invitePageRecords:
                      page.invitePageSize - page.invitePageSize,
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
                  page.totalInvitedMembers
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
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                frontIcon={<UserRoundIcon selected size={14} />}
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
            <Button onClick={inviteMember} disabled={isLoading}>
              Invite
            </Button>
          </div>
          <div className="table w-full">
            <div className="table-header-group">
              <div className="table-row text-muted-foreground">
                <div className="table-cell text-left border-b px-2">User</div>
                <div className="table-cell text-center border-b px-2">
                  Invited
                </div>
                <div className="table-cell text-left border-b"> </div>
              </div>
            </div>
            <div className="table-row-group">
              {invitedMembers.map((invitation) => (
                <div className="table-row" key={invitation.id}>
                  <div className="table-cell p-2 w-full">
                    {invitation.toUser.email}
                  </div>
                  <div className="table-cell text-center p-2">
                    {new Date(invitation.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 justify-end p-2 w-[170px]">
                    <Button
                      variant={"outline"}
                      className="h-7 hover:bg-destructive"
                      disabled={isLoading}
                      onClick={() => revokeInvitation(invitation.id)}
                    >
                      Remove Invitation
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">
              Displaying {invitedMembers.length} of {page.invitePageRecords}
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
                    invitePageRecords:
                      page.invitePageSize - page.invitePageSize,
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
                  page.totalInvitedMembers
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
        </div>
      )}
    </div>
  );
};

export default Member;
