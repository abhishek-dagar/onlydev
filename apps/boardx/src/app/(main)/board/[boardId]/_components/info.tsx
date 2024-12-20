import ActionButton from "@/app/(main)/app/dashboard/_components/action-button";
import Logo from "@/components/Logo";
import RenameModal from "@/components/models/rename-modal";
import {
  deleteBoard,
  fetchBoardById,
  updateBoard,
} from "@/lib/actions/board.action";
import Hint from "@repo/ui/components/common/hint";
import { Button } from "@repo/ui/components/ui/button";
import { BoardType } from "@repo/ui/lib/types/bards.type";
import { MenuIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface InfoProps {
  boardId: string;
  userId: string;
  workspaceId: string;
}
const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>;
};

export const Info = ({ boardId, userId, workspaceId }: InfoProps) => {
  const [data, setData] = useState<BoardType>();
  const router = useRouter();
  //   const data = useQuery(api.board.get, { id: boardId as Id<"boards"> });
  const updateBoardData = async (data: BoardType) => {
    const { board } = await updateBoard(data);
    if (board) setData(board);
  };

  const handleDelete = async () => {
    if (!data) return;
    const { board } = await deleteBoard(data.id);
    if (board) {
      router.push("/app/dashboard");
      return { success: "Board deleted successfully", err: undefined };
    } else {
      return { success: undefined, err: "Something went wrong" };
    }
  };

  const getBoard = async () => {
    const { board } = await fetchBoardById(boardId, userId);
    if (board) setData(board);
  };

  useEffect(() => {
    getBoard();
  }, [boardId]);

  if (!data) return <InfoSkeleton />;
  return (
    <div className="absolute top-2 left-2 bg-muted rounded-md px-1.5 h-10 flex items-center shadow-md">
      {/* <Hint label="Go to boards" side="bottom" sideOffset={10}>
        <Button variant={"board"} className="px-2">
          <Logo to={`/app/dashboard?workspaceId=${workspaceId}`} />
        </Button>
      </Hint>
      <TabSeparator />
      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <RenameModal board={data} updateBoardData={updateBoardData}>
          <Button
            variant={"board"}
            className="text-base font-normal px-2"
          >
            {data.name}
          </Button>
        </RenameModal>
      </Hint>
      <TabSeparator /> */}
      <ActionButton
        board={data}
        id={data.id}
        title={data.name}
        side="bottom"
        align="start"
        sideOffset={10}
        handleDelete={handleDelete}
        updateBoardData={updateBoardData}
      >
        <Button size={"icon"} variant={"board"} className="h-7 w-7">
          <MenuIcon size={18} />
        </Button>
      </ActionButton>
    </div>
  );
};

export const InfoSkeleton = () => {
  return (
    <div className="absolute top-2 left-2 bg-muted rounded-md px-1.5 h-10 flex items-center shadow-md w-10" />
  );
};
