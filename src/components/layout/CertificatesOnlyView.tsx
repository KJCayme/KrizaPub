import CertificatesViewOnly from '../CertificatesViewOnly';
import NetworkStatusIndicator from '../NetworkStatusIndicator';
import { Toaster } from 'sonner';

interface CertificatesOnlyViewProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
}

const CertificatesOnlyView = ({ isDarkMode, onToggleDarkMode, onBack }: CertificatesOnlyViewProps) => {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <NetworkStatusIndicator />
      <CertificatesViewOnly 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={onToggleDarkMode}
        onBack={onBack}
      />
      <Toaster />
    </div>
  );
};

export default CertificatesOnlyView;