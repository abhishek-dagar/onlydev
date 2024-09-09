import SideBar from "@/components/navbars/side-bar";
import { currentUser } from "@repo/ui/lib/helpers/getTokenData";
import { UserType } from "@repo/ui/lib/types/user.types";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user: UserType = await currentUser();
  if (!user) redirect("/signin");
  return (
    <div className="flex overflow-hidden h-screen w-screen">
      <SideBar user={user} />
      <div className="w-full flex h-full">
        {children}
      </div>
      {/* <MobileBottomBar user={user}/> */}
    </div>
  );
}
