import { currentUser } from "@repo/ui/lib/helpers/getTokenData";
import ListBoards from "./_components/list-boards";

const Dashboard = async () => {
  const user = await currentUser();
  return (
    <div className="flex-1 h-full flex flex-col">
      <ListBoards user={user} />
    </div>
  );
};

export default Dashboard;
