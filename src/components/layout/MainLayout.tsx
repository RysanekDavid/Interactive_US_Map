import { ReactNode } from "react";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-300">
      <Header title="US Political Map" />
      <main className="pt-14">
        {" "}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 lg:gap-6">{children}</div>
        </div>
      </main>
    </div>
  );
};
