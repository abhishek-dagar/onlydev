import { BoardType } from "@repo/ui/lib/types/bards.type";
import { cn } from "@repo/ui/lib/utils";
import { MoreHorizontalIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ActionButton from "./action-button";

const BoardCard = ({
  board,
  updateBoardData,
  handleDelete,
}: {
  board: BoardType;
  updateBoardData: (data: BoardType) => void;
  handleDelete: (id: string) => Promise<{
    success: string | undefined;
    err: string | undefined;
  }>;
}) => {
  const deleteBoard = async () => {
    return await handleDelete(board.id);
  };
  return (
    <Link href={`/board/${board.id}`}>
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image
            src={board.imageUrl}
            alt={board.name}
            fill
            className="object-fit"
          />
          <Overlay />
          <ActionButton
            board={board}
            id={board.id}
            title={board.name}
            side="right"
            handleDelete={deleteBoard}
            updateBoardData={updateBoardData}
          >
            <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 px-3 py-2 outline-none">
              <MoreHorizontalIcon className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </ActionButton>
        </div>
        <Footer board={board} updateBoardData={updateBoardData} />
      </div>
    </Link>
  );
};

const Footer = ({
  board,
  updateBoardData,
}: {
  board: BoardType;
  updateBoardData: (data: BoardType) => void;
}) => {
  const createdAtLabel = new Date(board.createdAt).toLocaleDateString();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    updateBoardData({ ...board, isFavorite: !board.isFavorite });
  };

  return (
    <div className="relative bg-white p-3">
      <p className="text-[13px] text-muted-foreground truncate max-w-[(calc(100%-20px)]">
        {board.name}
      </p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
        {createdAtLabel}
      </p>
      <button
        onClick={handleClick}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600"
          //   disabled && "cursor-not-allowed opacity-75"
        )}
      >
        <StarIcon
          className={cn(
            "h-4 w-4",
            board.isFavorite && "fill-blue-600 text-blue-600"
          )}
        />
      </button>
    </div>
  );
};

export const Overlay = () => {
  return (
    <div className="opacity-0 group-hover:opacity-50 transition-opacity h-full w-full bg-black" />
  );
};

export default BoardCard;
