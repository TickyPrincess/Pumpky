import { AppNav } from "@/components/layout/app-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030303]">
      <AppNav />
      <main className="min-h-screen flex flex-col lg:ml-[220px] pt-14 lg:pt-0 pb-16 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
