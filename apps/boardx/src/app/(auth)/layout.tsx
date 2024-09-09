
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
