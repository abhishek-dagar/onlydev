import SubSidebar from "@/components/navbars/sub-side-bar";
import { currentUser } from "@repo/ui/lib/helpers/getTokenData";
import { UserType } from "@repo/ui/lib/types/user.types";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user: UserType = await currentUser();
  if (!user) redirect("/signin");
  return (
    <>
      <SubSidebar user={user}/>
      {children}
    </>
  );
}
