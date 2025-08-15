
import CertificatesViewOnly from '../CertificatesViewOnly';
import NetworkStatusIndicator from '../NetworkStatusIndicator';
import { Toaster } from 'sonner';

interface CertificatesOnlyViewProps {
  onBack: () => void;
}

const CertificatesOnlyView = ({ onBack }: CertificatesOnlyViewProps) => {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <NetworkStatusIndicator />
      <CertificatesViewOnly 
        onBack={onBack}
      />
      <Toaster />
    </div>
  );
};

export default CertificatesOnlyView;
