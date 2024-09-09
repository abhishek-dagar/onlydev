"use server";

import { db } from "@repo/ui/lib/db";

const images = [
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
  "/placeholders/6.svg",
  "/placeholders/7.svg",
  "/placeholders/8.svg",
  "/placeholders/9.svg",
  "/placeholders/10.svg",
];

export const createBoard = async (data: any) => {
  "use server";
  try {
    const workspaceId = data.boardWorkspaceId;
    delete data.boardWorkspaceId;
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const newBoard = await db.board.create({
      data: {
        ...data,
        boardWorkspace: {
          connect: {
            id: workspaceId,
          },
        },
        imageUrl: randomImage,
      },
    });
    return { err: undefined, board: newBoard };
  } catch (error: any) {
    return { err: error.message, board: undefined };
  }
};

export const fetchBoards = async (workspaceId: string) => {
  "use server";
  try {
    const boardWorkspace = await db.boardWorkspaces.findUnique({
      where: {
        id: workspaceId,
      },
    });

    if (!boardWorkspace) {
      return { err: "Board Workspace not found", boards: undefined };
    }
    const boards = await db.board.findMany({
      where: {
        boardWorkspaceId: workspaceId,
      },
    });
    return { err: undefined, boards };
  } catch (error: any) {
    return { err: error.message, boards: undefined };
  }
};

export const fetchBoardById = async (boardId: string, userId: String) => {
  "use server";
  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
      },
    });

    if (!board) {
      return { err: "Board not found", board: undefined };
    }

    const boardWorkspace = await db.boardWorkspaces.findUnique({
      where: {
        id: board.boardWorkspaceId,
      },
      include: {
        members: true,
      },
    });

    const isMember = boardWorkspace?.members.some(
      (member) => member.id === userId
    );
    if (!isMember && boardWorkspace?.userId !== userId)
      return { err: "Board not found", board: undefined };

    return { err: undefined, board };
  } catch (error: any) {
    return { err: error.message, board: undefined };
  }
};

export const deleteBoard = async (boardId: string) => {
  "use server";
  try {
    const deletedBoard = await db.board.delete({
      where: {
        id: boardId,
      },
    });
    return { err: undefined, board: deletedBoard };
  } catch (error: any) {
    return { err: error.message, board: undefined };
  }
};

export const updateBoard = async (board: any) => {
  "use server";
  try {
    const previousBoard = await db.board.findUnique({
      where: {
        id: board.id,
      },
    });
    const updatedBoard = await db.board.update({
      where: {
        id: board.id,
      },
      data: board,
    });
    return { err: undefined, board: updatedBoard, previousBoard };
  } catch (error: any) {
    return { err: error.message, board: undefined, previousBoard: undefined };
  }
};
