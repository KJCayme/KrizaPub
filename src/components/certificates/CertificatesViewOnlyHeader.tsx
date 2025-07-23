
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface CertificatesViewOnlyHeaderProps {
  onBack: () => void;
}

export const CertificatesViewOnlyHeader = ({ onBack }: CertificatesViewOnlyHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Portfolio
      </Button>
      <h1 className="text-3xl font-bold">All Certificates</h1>
    </div>
  );
};
