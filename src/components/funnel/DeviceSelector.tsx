
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
        ? 'bg-funnel-device-bg-active text-funnel-device-text-active'
        : 'bg-funnel-device-bg text-funnel-device-text hover:bg-nav-bg-hover'
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
