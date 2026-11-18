import { QrCode } from "lucide-react";
export default function Header() {
  return (
    <header className="border-b border-black/[0.07] bg-white">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 py-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
          <QrCode size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">Fancy QR Studio</h1>
          <p className="text-xs text-muted">
            Create beautiful branded QR codes.
          </p>
        </div>
        <span className="ml-auto rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-[#00806a]">
          Free QR Generator
        </span>
      </div>
    </header>
  );
}
