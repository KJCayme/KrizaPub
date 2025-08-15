
import TestimonialsViewOnly from '../TestimonialsViewOnly';
import NetworkStatusIndicator from '../NetworkStatusIndicator';
import { Toaster } from 'sonner';

interface TestimonialsOnlyViewProps {
  onBack: () => void;
}

const TestimonialsOnlyView = ({ onBack }: TestimonialsOnlyViewProps) => {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <NetworkStatusIndicator />
      <TestimonialsViewOnly 
        onBack={onBack}
      />
      <Toaster />
    </div>
  );
};

export default TestimonialsOnlyView;
