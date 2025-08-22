import { Ruler, Building2 } from "lucide-react";

export function Header() {
  return (
    <header className="relative bg-white border-b border-primary/10">
      <div className="blueprint-grid-fine absolute inset-0 opacity-30"></div>
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
              <Ruler className="w-2 h-2 text-white" />
            </div>
          </div>
          <div className="architectural-line flex-1">
            <h1 className="text-4xl font-bold text-primary tracking-tight">
              Architectural Plans Compliance Checker
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Professional blueprint validation & regulatory compliance analysis
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}