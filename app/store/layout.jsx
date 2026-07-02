'use client'
import StoreLayout from "@/components/store/StoreLayout";
import Footer from "@/components/Footer";
import { Show } from "@clerk/nextjs";

export default function RootStoreLayout({ children }) {
  return (
    <>
      <Show when="signed-in">
        <StoreLayout>
          {children}
        </StoreLayout>
      </Show>
      <Show when="signed-out">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="min-h-[80vh] flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">
              Please login to access the store dashboard
            </h1>
          </div>
        </main>
        <Footer />
      </Show>
    </>
  );
}
