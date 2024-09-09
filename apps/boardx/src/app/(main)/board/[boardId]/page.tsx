import React from "react";
import Canvas from "./_components/canvas";
import { currentUser } from "@repo/ui/lib/helpers/getTokenData";
import { redirect } from "next/navigation";
import { fetchBoardById } from "@/lib/actions/board.action";

const BoardPage = async ({ params }: { params: { boardId: string } }) => {
  const user = await currentUser();
  if (!user) redirect("/signin");
  const {board} = await fetchBoardById(params.boardId);
  if (!board) redirect("/app/dashboard");
  return (
    <div className="h-screen w-screen">
      <Canvas boardId={params.boardId} board={board} user={user} />
    </div>
  );
};

export default BoardPage;
