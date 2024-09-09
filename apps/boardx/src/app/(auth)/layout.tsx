import { currentUser } from "@repo/ui/lib/helpers/getTokenData";
import { UserType } from "@repo/ui/lib/types/user.types";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const user: UserType = await currentUser();
  // if (user) redirect("/app/dashboard");
  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">
      <div className="z-20">{children}</div>
    </div>
  );
}
