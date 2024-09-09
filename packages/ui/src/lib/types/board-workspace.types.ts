import { z } from "zod";
import { BoardWorkspaces } from "@prisma/client";
import { UserType } from "./user.types";

export const boardWorkspacesValidation = z.object({
  name: z.string(),
  description: z.string(),
});

export interface BoardWorkspacesType extends BoardWorkspaces {
  user?: UserType | null;
}
