"use client";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { UserType } from "@repo/ui/lib/types/user.types";
import { BoardType } from "@repo/ui/lib/types/bards.type";
import { updateBoard } from "@/lib/actions/board.action";
// import Canvas from "./new-canvas";
const Canvas = dynamic(async () => (await import("./new-canvas")).default, {
  ssr: false,
});

const Board = ({ user, board }: { user: UserType; board: BoardType }) => {
  const [updatedBoard, setUpdatedBoard] = useState(board);

  const updateDbBoard = async (data: BoardType) => {
    const res = await updateBoard(data);
    if (res.board) setUpdatedBoard(res.board);
  };

  useEffect(() => {
    setUpdatedBoard(board);
  }, [board]);
  return (
    <Suspense fallback={<>Loading...</>}>
      <Canvas board={updatedBoard} user={user} updateDbBoard={updateDbBoard} />
    </Suspense>
  );
};

export default Board;
