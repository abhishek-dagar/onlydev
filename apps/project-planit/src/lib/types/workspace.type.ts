import { z } from "zod";
import { workspace } from "@prisma/client";

export const workspaceValidation = z.object({
  name: z.string(),
  description: z.string(),
});

export interface WorkspaceType extends workspace{}
