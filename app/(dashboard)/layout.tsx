import { createClient } from "@/utils/supabase/server";
import { Sidebar } from "./components/sidebar";
import DashboardHeader from "./components/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.user_metadata?.role;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden border-r bg-muted/40 md:block md:w-64 md:shrink-0 lg:w-72">
        <Sidebar className="h-full" role={role} />
      </div>
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
