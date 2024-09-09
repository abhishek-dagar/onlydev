import { useState } from "react";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { UserType } from "@repo/ui/lib/types/user.types";
import { cn } from "@repo/ui/lib/utils";
import { PlusIcon, WholeWordIcon } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@repo/ui/components/ui/input";
import { Icons } from "@repo/ui/components/icons/index";
import { createBoardWorkspace } from "@/lib/actions/board-workspace.action";
import {
  BoardWorkspacesType,
  boardWorkspacesValidation,
} from "@repo/ui/lib/types/board-workspace.types";
import { toast } from "sonner";

const AddBoardModel = ({
  user,
  addWorkspace,
  children,
}: {
  user: UserType;
  addWorkspace?: (value: BoardWorkspacesType) => void;
  children?: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //   const [upgradePlanModalOpen, setUpgradePlanModalOpen] =
  //     useState<boolean>(false);
  //   const [tier, setTier] = useState();
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const createBoardForm: any = useForm({
    resolver: zodResolver(boardWorkspacesValidation),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof boardWorkspacesValidation>) {
    setIsLoading(true);

    try {
      const { boardWorkspace, err } = await createBoardWorkspace({
        ...values,
        userId: user?.id,
      });

      if (boardWorkspace) {
        if (addWorkspace) addWorkspace(boardWorkspace as BoardWorkspacesType);
        toast.success("Workspace Created");
        router.push(`/app/dashboard?workspaceId=${boardWorkspace.id}`);
        setOpen(false);
        createBoardForm.reset();
      } else {
        toast.error(err);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button size={"icon"} variant={"secondary"}>
            <PlusIcon />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle />
        <div className="w-full flex justify-center">
          <Avatar className="h-20 w-20 rounded-xl">
            <AvatarFallback className="rounded-xl capitalize text-2xl">
              {createBoardForm.getValues("name").split("")[0] || "W"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className={cn("grid gap-6")}>
          <Form {...createBoardForm}>
            <form onSubmit={createBoardForm.handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <FormField
                  control={createBoardForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name"
                          type="text"
                          autoCapitalize="none"
                          autoComplete="none"
                          autoCorrect="off"
                          frontIcon={
                            <WholeWordIcon
                              size={14}
                              className="text-muted-foreground"
                            />
                          }
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createBoardForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="description"
                          rows={3}
                          disabled={isLoading}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading}>
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <></>
                  )}
                  Create Workspace
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBoardModel;
