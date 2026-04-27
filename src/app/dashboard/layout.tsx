import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-obsidian-950">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-volt-400/20 to-transparent" />
        <div className="absolute top-32 right-10 w-72 h-72 bg-obsidian-800/20 rounded-full blur-3xl" />
      </div>
      <Navbar />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
