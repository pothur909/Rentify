

// DashboardLayout.tsx
import Sidebar from "../dashboard/components/Sidebar";
import { NotificationProvider } from "../context/NotificationContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="flex w-full max-w-full overflow-x-hidden pt-20">
          <Sidebar />

          <main className="flex-1 w-0 px-4 lg:px-8 py-6 lg:py-8 lg:ml-6">
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}
