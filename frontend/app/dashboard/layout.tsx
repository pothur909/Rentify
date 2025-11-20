


// DashboardLayout.tsx
import Sidebar from "../dashboard/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-20">
      <Sidebar />
      <main className="flex-1 p-8 ml-6">{children}</main>
    </div>
  );
}