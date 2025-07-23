
import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface CertificatesViewOnlyNavProps {
  onBack: () => void;
  onToggleDarkMode: () => void;
  onAddCertificate: () => void;
  isDarkMode: boolean;
  user: any;
}

const CertificatesViewOnlyNav = ({ 
  onBack, 
  onToggleDarkMode, 
  onAddCertificate, 
  isDarkMode, 
  user 
}: CertificatesViewOnlyNavProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Certificates</h1>
            {user && (
              <Button
                onClick={onAddCertificate}
                variant="ghost"
                className="text-white hover:bg-white/20 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Certificate
              </Button>
            )}
          </div>
          
          <Button
            onClick={onToggleDarkMode}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 transition-colors"
          >
            {isDarkMode ? (
              <span className="text-lg">☀️</span>
            ) : (
              <span className="text-lg">🌙</span>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default CertificatesViewOnlyNav;
