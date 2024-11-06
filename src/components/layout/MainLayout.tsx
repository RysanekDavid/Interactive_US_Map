import { ReactNode } from "react";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-[calc(100vh-2rem)] bg-gray-100 p-6">
      <div className="container mx-auto h-full">
        <div className="flex flex-col h-full gap-6">
          <Header
            title="US Political Map"
            subtitle="Interactive visualization of US political landscape"
          />
          {children}
        </div>
      </div>
    </div>
  );
};
