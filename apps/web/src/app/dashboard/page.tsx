import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "../../services";
import Dashboard from "./dashboard";

export const instant = false;

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.user.name}</p>
      <Dashboard session={session} />
    </div>
  );
};

export default DashboardPage;
