import React from 'react';
import { handleBookCall } from '../../utils/bookCall';

const PortfolioCallToAction: React.FC = () => {
  return (
    <div className="mt-20 text-center">
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-3xl p-12 border border-blue-500/20 backdrop-blur-sm">
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Project?
        </h3>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Let's discuss how I can help bring your ideas to life. Book a consultation 
          or get in touch to explore the possibilities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => handleBookCall()}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full transition-all duration-300 hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/25"
          >
            Book a Call
          </button>
          <button 
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/10 transform hover:-translate-y-1"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCallToAction;