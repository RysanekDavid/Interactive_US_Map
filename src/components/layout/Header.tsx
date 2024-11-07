import usaLogo from "../../../public/AppBarLogo/usa.svg";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title }: HeaderProps) => {
  return (
    <header className="bg-[#1E293B] fixed top-0 left-0 right-0 z-50 h-14">
      <div className="flex items-center h-full px-4">
        <div className="flex items-center gap-3">
          <img src={usaLogo} alt="USA Logo" className="h-10 w-10" />
          <h1 className="text-[16px] font-medium text-white">{title}</h1>
        </div>
      </div>
    </header>
  );
};
