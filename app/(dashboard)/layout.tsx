import { createClient } from "@/utils/supabase/server";
import Navbar from "@/app/landing/components/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 pt-24 container mx-auto px-4">{children}</main>
    </div>
  );
}
