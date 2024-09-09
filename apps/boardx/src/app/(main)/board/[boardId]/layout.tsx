import { Suspense } from "react";
import { Loading } from "./_components/canvas/loading";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const user: UserType = await currentUser();
  // if (user) redirect("/app/dashboard");
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
