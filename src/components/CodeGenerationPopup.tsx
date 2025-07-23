
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Copy, Check } from 'lucide-react';

interface CodeGenerationPopupProps {
  code: string;
  onClose: () => void;
}

const CodeGenerationPopup: React.FC<CodeGenerationPopupProps> = ({ code, onClose }) => {
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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
              Generated Code
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Share this code with your client to let them fill out their testimonial:
              </p>
              <div className="flex gap-2">
                <Input
                  value={code}
                  readOnly
                  className="font-mono text-center text-lg font-bold"
                />
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              <p>• This code allows your client to update their testimonial without signing in</p>
              <p>• The code is unique and can only be used to update one testimonial</p>
              <p>• Keep this code secure and share it only with your client</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerationPopup;
