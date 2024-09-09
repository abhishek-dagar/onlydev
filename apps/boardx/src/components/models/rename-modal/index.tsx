"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { FormEventHandler, forwardRef, useEffect, useState } from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { BoardType } from "@repo/ui/lib/types/bards.type";
import { PencilIcon } from "lucide-react";

const RenameModal = forwardRef(
  (
    {
      board,
      updateBoardData,
      children,
    }: {
      board: BoardType;
      children?: React.ReactNode;
      updateBoardData: (data: BoardType) => void;
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(board.name);
    useEffect(() => {
      setTitle(board.name);
    }, [board.name]);

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault();
      updateBoardData({ ...board, name: title });
      setOpen(false);
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {children ? (
          <DialogTrigger asChild>{children}</DialogTrigger>
        ) : (
          <DialogTrigger className="inline-flex items-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 p-3 cursor-pointer text-sm w-full justify-start font-normal">
            <PencilIcon className="h-4 w-4 mr-2" />
            Rename
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit board title</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Enter a new title here for this board
          </DialogDescription>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              // disabled={pending}
              required
              maxLength={60}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Board title"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant={"outline"}>
                  cancel
                </Button>
              </DialogClose>
              <Button type="submit">save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

export default RenameModal;
