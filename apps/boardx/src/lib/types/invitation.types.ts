import { BoardWorkSpaceInvitation } from "@repo/db";
import { UserType } from "@repo/ui/lib/types/user.types";

export interface InvitationType extends BoardWorkSpaceInvitation {
  createdAt: Date;
  fromUser: UserType;
  toUser: UserType;
}
