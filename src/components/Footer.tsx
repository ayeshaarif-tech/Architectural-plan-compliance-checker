import { Mail, Shield, FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-primary/10 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>Contact: info@example.com</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a 
              href="#" 
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <FileText className="w-4 h-4" />
              Terms of Service
            </a>
            <span>|</span>
            <a 
              href="#" 
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Shield className="w-4 h-4" />
              Privacy Policy
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-primary/10 text-center text-sm text-muted-foreground">
          <p>© 2024 Architectural Plans Compliance Checker. Professional blueprint validation & regulatory compliance analysis.</p>
        </div>
      </div>
    </footer>
  );
}