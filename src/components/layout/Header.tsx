import usaLogo from "../../../public/AppBarLogo/usa.svg"; // Ujistěte se, že máte správnou cestu k logu

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="bg-slate-900 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="h-12 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center">
            <img src={usaLogo} alt="USA Logo" className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-[16px] font-medium text-white">{title}</h1>
            {subtitle && <p className="text-sm text-slate-300">{subtitle}</p>}
          </div>
        </div>
      </div>
    </header>
  );
};
