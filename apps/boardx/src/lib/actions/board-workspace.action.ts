"use server";

import { db } from "@repo/ui/lib/db";
import { InvitationType } from "../types/invitation.types";

export const createBoardWorkspace = async (data: any) => {
  "use server";

  try {
    const newBoardWorkspace = await db.boardWorkspaces.create({
      data: {
        ...data,
      },
    });
    return { err: undefined, boardWorkspace: newBoardWorkspace };
  } catch (error: any) {
    return { err: error.message, boardWorkspace: undefined };
  }
};

export const fetchBoardWorkspaces = async (userId: string) => {
  "use server";
  try {
    const boardWorkspaces = await db.boardWorkspaces.findMany({
      where: { OR: [{ userId }, { members: { some: { id: userId } } }] },
      include: {
        user: true,
      },
    });
    return { err: undefined, boardWorkspaces };
  } catch (error: any) {
    return { err: error.message, boardWorkspaces: undefined };
  }
};

export const fetchBoardWorkspaceById = async (id: string) => {
  "use server";
  try {
    const boardWorkspace = await db.boardWorkspaces.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if (!boardWorkspace)
      return { err: "Workspace not found", boardWorkspace: undefined };
    return { err: undefined, boardWorkspace };
  } catch (error: any) {
    return { err: error.message, boardWorkspace: undefined };
  }
};

export const updateBoardWorkspace = async (data: any) => {
  "use server";
  try {
    const updatedBoardWorkspace = await db.boardWorkspaces.update({
      where: { id: data.id },
      data: {
        ...data,
      },
    });
    return { err: undefined, boardWorkspace: updatedBoardWorkspace };
  } catch (error: any) {
    return { err: error.message, boardWorkspace: undefined };
  }
};

export const deleteBoardWorkspace = async (id: string) => {
  "use server";
  try {
    const deletedBoardWorkspace = await db.boardWorkspaces.delete({
      where: { id },
      include: { members: true },
    });
    return { err: undefined, boardWorkspace: deletedBoardWorkspace };
  } catch (error: any) {
    return { err: error.message, boardWorkspace: undefined };
  }
};

export const inviteMemberToBoardWorkspace = async (data: any) => {
  "use server";
  try {
    const inviteMember = await db.user.findUnique({
      where: { email: data.email },
    });
    if (!inviteMember)
      return { err: "Member not found", invitation: undefined };

    const workspace = await db.boardWorkspaces.findUnique({
      where: { id: data.BoardWorkSpaceId },
      include: { members: true },
    });

    if (!workspace)
      return { err: "Workspace not found", invitation: undefined };

    const isMember = workspace.members.some(
      (member) => member.id === inviteMember.id
    );

    if (isMember)
      return { err: "Member already exists", invitation: undefined };

    const existingInvitation = await db.boardWorkSpaceInvitation.findMany({
      where: {
        toUserId: inviteMember.id,
        BoardWorkSpaceId: data.BoardWorkSpaceId,
      },
    });
    console.log(existingInvitation);

    if (existingInvitation.length > 0)
      return { err: "Invitation already sent", invitation: undefined };

    delete data.email;
    const invitation = await db.boardWorkSpaceInvitation.create({
      data: {
        ...data,
        toUserId: inviteMember.id,
      },
    });
    return { err: undefined, invitation };
  } catch (error: any) {
    return { err: error.message, invitation: undefined };
  }
};

export const fetchInvitedMembers = async (
  userId: string,
  workspaceId: string,
  skip: number,
  take: number
) => {
  "use server";
  try {
    const invitations = await db.boardWorkSpaceInvitation.findMany({
      where: {
        fromUserId: userId,
        BoardWorkSpaceId: workspaceId,
      },
      include: {
        fromUser: true,
        toUser: true,
      },
      skip, // Skip the calculated number of records
      take,
    });
    const invitationsWithoutPage = await db.boardWorkSpaceInvitation.findMany({
      where: {
        fromUserId: userId,
        BoardWorkSpaceId: workspaceId,
      },
      include: {
        fromUser: true,
        toUser: true,
      },
    });
    return {
      err: undefined,
      invitations,
      totalInvitations: invitationsWithoutPage.length,
    };
  } catch (error: any) {
    return { err: error.message, invitations: undefined, totalInvitations: 0 };
  }
};

export const fetchInvitations = async (
  userId: string,
  skip: number,
  take: number
) => {
  "use server";
  try {
    const invitations = await db.boardWorkSpaceInvitation.findMany({
      where: {
        toUserId: userId,
      },
      include: {
        fromUser: true,
        toUser: true,
      },
      skip, // Skip the calculated number of records
      take,
    });
    const invitationsWithoutPage = await db.boardWorkSpaceInvitation.findMany({
      where: {
        toUserId: userId,
      },
      include: {
        fromUser: true,
        toUser: true,
      },
    });

    return {
      err: undefined,
      invitations,
      totalInvitations: invitationsWithoutPage.length,
    };
  } catch (error: any) {
    return { err: error.message, invitations: undefined, totalInvitations: 0 };
  }
};

export const removeInvitation = async (id: string) => {
  "use server";
  try {
    console.log(id);

    const deletedInvitation = await db.boardWorkSpaceInvitation.delete({
      where: { id },
    });
    return { err: undefined, invitation: deletedInvitation };
  } catch (error: any) {
    return { err: error.message, invitation: undefined };
  }
};

export const fetchWorkspaceMembers = async (
  workspaceId: string,
  skip: number,
  take: number
) => {
  "use server";
  try {
    const workspace = await db.boardWorkspaces.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });
    if (!workspace) return { err: "Workspace not found", members: undefined };

    return {
      err: undefined,
      members: workspace.members,
    };
  } catch (error: any) {
    return { err: error.message, members: undefined };
  }
};

export const removeMemberFromBoardWorkspace = async (data: any) => {
  "use server";
  try {
    const removedMember = await db.boardWorkspaces.update({
      where: { id: data.boardWorkspaceId },
      data: {
        members: {
          disconnect: {
            id: data.memberId,
          },
        },
      },
    });
    return { err: undefined, member: removedMember };
  } catch (error: any) {
    return { err: error.message, member: undefined };
  }
};

export const acceptInvitation = async (data: InvitationType) => {
  "use server";
  try {
    const workspace = await db.boardWorkspaces.update({
      where: { id: data.BoardWorkSpaceId },
      data: {
        members: {
          connect: {
            id: data.toUserId!,
          },
        },
      },
    });
    const invitation = await db.boardWorkSpaceInvitation.delete({
      where: { id: data.id },
    });
    return { err: undefined, invitation };
  } catch (error: any) {
    return { err: error.message, invitation: undefined };
  }
};
