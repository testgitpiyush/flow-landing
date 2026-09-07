import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/Dashboard";
import { CTA } from "@/components/CTA";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
          Your Workspace
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Welcome back{session.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="mt-4 text-neutral-400 text-lg">
          Your tasks, focus stats, and AI recommendations, all based on your real data.
        </p>
      </div>
      <Dashboard />
      <CTA />
    </div>
  );
}
