"use client";
import { UserType } from "@repo/ui/lib/types/user.types";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createBoard,
  deleteBoard,
  fetchBoards,
  updateBoard,
} from "@/lib/actions/board.action";
import { toast } from "sonner";
import BoardCard from "./board-card";
import { BoardType } from "@repo/ui/lib/types/bards.type";
import EmptyOrg from "./empty-components/empty-org";
import EmptyFavorite from "./empty-components/empty-favorites";
import EmptyBoard from "./empty-components/empty-board";
import DashboardTopBar from "@/components/navbars/dashboard-top-bar";
import Loading from "./loading";

const ListBoards = ({ user }: { user: UserType }) => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const getBoards = async () => {
    setIsLoading(true);

    const { boards } = await fetchBoards(searchParams.get("workspaceId")!);
    if (boards) setBoards(boards);
    else router.push("/app/dashboard");

    setIsLoading(false);
  };
  const createNewBoard = async () => {
    const { board, err } = await createBoard({
      name: "Untitled Board",
      description: "",
      boardWorkspaceId: searchParams.get("workspaceId")!,
      isFavorite: searchParams.get("favorite") === "true" ? true : false,
    });
    if (board) {
      setBoards([...boards, board]);
      toast.success("Board created successfully");
    } else {
      toast.error(err);
    }
  };

  const updateBoardData = async (data: BoardType) => {
    const { board } = await updateBoard(data);
    if (board) setBoards(boards.map((b) => (b.id === data.id ? board : b)));
  };

  const handleDelete = async (id: string) => {
    const { board } = await deleteBoard(id);
    if (board) {
      setBoards(boards.filter((board) => board.id !== id));
      return { success: "Board deleted successfully", err: undefined };
    } else {
      return { success: undefined, err: "Something went wrong" };
    }
  };

  React.useEffect(() => {
    getBoards();
  }, [searchParams, searchParams.get("workspaceId")]);
  
  return (
    <>
      <DashboardTopBar
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {isLoading ? (
        <Loading />
      ) : !searchParams.get("workspaceId") ? (
        <EmptyOrg user={user} />
      ) : !boards || boards?.length === 0 ? (
        <EmptyBoard createBoard={createNewBoard} />
      ) : boards?.filter((board) =>
          searchParams.get("favorite") === "true" ? board.isFavorite : true
        ).length === 0 ? (
        <EmptyFavorite />
      ) : (
        <div className="h-full overflow-auto px-6">
          <h2 className="text-3xl">
            {searchParams.get("favorite") === "true" && "Favorite "}Boards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
            <button
              className="col-span-1 aspect-[100/127] bg-primary rounded-lg hover:bg-primary/60 flex flex-col items-center justify-center py-6 text-white"
              onClick={createNewBoard}
            >
              <PlusIcon />
              <p className="text-xs font-light">New board</p>
            </button>
            {boards
              ?.filter((board) =>
                searchParams.get("favorite") === "true"
                  ? board.isFavorite
                  : true
              )
              .filter((board) =>
                board.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  updateBoardData={updateBoardData}
                  handleDelete={handleDelete}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ListBoards;
