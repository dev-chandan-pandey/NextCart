'use client'
import AdminLayout from "@/components/admin/AdminLayout";
import { Show } from "@clerk/nextjs";

export default function RootAdminLayout({ children }) {
  return (
    <>
      <Show when="signed-in">
        <AdminLayout>
          {children}
        </AdminLayout>
      </Show>
      <Show when="signed-out">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="min-h-[80vh] flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">
              Please login to access the admin dashboard
            </h1>
          </div>
        </main>
      </Show>
    </>
  );
}
