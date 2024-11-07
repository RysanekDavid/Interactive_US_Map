import { ReactNode } from "react";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Header title="US Political Map" />
      <main className="pt-14 min-h-[calc(100vh-3.5rem)]">
        <div className="flex flex-col h-full">{children}</div>
      </main>
    </>
  );
};
