
import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

interface DeviceSelectorProps {
  selectedDevice: 'desktop' | 'tablet' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void;
}

const DeviceSelector = ({ selectedDevice, onDeviceChange }: DeviceSelectorProps) => {
  const buttonClass = (device: 'desktop' | 'tablet' | 'mobile') => 
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      selectedDevice === device
        ? 'bg-blue-600 text-white'
        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
    }`;

  return (
    <div className="flex gap-3 justify-center">
      <button
        onClick={() => onDeviceChange('desktop')}
        className={buttonClass('desktop')}
      >
        <Monitor className="w-4 h-4" />
        Desktop
      </button>
      <button
        onClick={() => onDeviceChange('tablet')}
        className={buttonClass('tablet')}
      >
        <Tablet className="w-4 h-4" />
        Tablet
      </button>
      <button
        onClick={() => onDeviceChange('mobile')}
        className={buttonClass('mobile')}
      >
        <Smartphone className="w-4 h-4" />
        Mobile
      </button>
    </div>
  );
};

export default DeviceSelector;
