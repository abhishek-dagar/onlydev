"use client";

// import { useOthers, useSelf } from "@/liveblocks.config";
import { useState, useEffect } from "react";
import { connectionIdToColor } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";
import { UserType } from "@repo/ui/lib/types/user.types";
import { fetchUserProfiles } from "@repo/ui/lib/actions/user.action";

const MAX_SHOWN_OTHER_USER = 2;

export const Participants = ({
  connectedUsers,
  currentUser,
}: {
  connectedUsers: string[];
  currentUser: UserType;
}) => {
  // const users = useOthers();
  const [users, setUsers] = useState<UserType[]>([]);
  useEffect(() => {
    fetchUserProfiles(
      Array.isArray(connectedUsers)
        ? connectedUsers?.filter((id) => id !== currentUser?.id)
        : []
    ).then(({ users }) => {
      if (users) setUsers(users);
    });
  }, [currentUser?.id, connectedUsers]);
  const hasMoreUsers = users.length > MAX_SHOWN_OTHER_USER;
  return (
    <div className="absolute h-12 top-2 right-2 bg-muted rounded-md p-3 flex items-center shadow-md">
      <div className="flex gap-x-2">
        {users.slice(0, MAX_SHOWN_OTHER_USER).map((user, index) => {
          return (
            <UserAvatar
              key={index}
              // src={info?.picture}
              name={user?.name || user?.email.split("@")[0] || "Teammate"}
              fallback={user?.name?.[0] || user?.email?.[0] || "T"}
              borderColor={connectionIdToColor(index)}
            />
          );
        })}
        {currentUser && (
          <UserAvatar
            // borderColor={connectionIdToColor(currentUser.connectionId)}
            // src={currentUser.info?.picture}
            name={`${currentUser?.name || currentUser?.email.split("@")[0]} (You)`}
            fallback={currentUser?.name?.[0] || currentUser?.email?.[0] || "T"}
          />
        )}
        {hasMoreUsers && (
          <UserAvatar
            name={`${users.length - MAX_SHOWN_OTHER_USER} more`}
            fallback={`+${users.length - MAX_SHOWN_OTHER_USER}`}
          />
        )}
      </div>
    </div>
  );
};

export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute h-12 top-2 right-2 bg-muted rounded-md p-3 flex items-center shadow-md w-[100px]" />
  );
};
