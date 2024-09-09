import { currentUser } from "@repo/ui/lib/helpers/getTokenData";
import { redirect } from "next/navigation";

export default async function Home() {
  const user: any = await currentUser();
  if (user) redirect("/app/dashboard");
  redirect("/signin");
}
