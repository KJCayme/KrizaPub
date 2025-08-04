import TestimonialsViewOnly from '../TestimonialsViewOnly';
import NetworkStatusIndicator from '../NetworkStatusIndicator';
import { Toaster } from 'sonner';

interface TestimonialsOnlyViewProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
}

const TestimonialsOnlyView = ({ isDarkMode, onToggleDarkMode, onBack }: TestimonialsOnlyViewProps) => {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <NetworkStatusIndicator />
      <TestimonialsViewOnly 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={onToggleDarkMode}
        onBack={onBack}
      />
      <Toaster />
    </div>
  );
};

export default TestimonialsOnlyView;