
import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface CodeGenerationPopupProps {
  code: string;
  onClose: () => void;
}

const CodeGenerationPopup = ({ code, onClose }: CodeGenerationPopupProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Testimonial Code Generated
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Share this code with your client to allow them to submit a testimonial:
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold text-slate-800 dark:text-white">
                {code}
              </span>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="ml-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerationPopup;
