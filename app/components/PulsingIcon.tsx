import React, { useState, useEffect } from 'react';
import { Icon } from '@phosphor-icons/react';

interface PulsingIconProps {
  Icon: Icon;
  size: number;
}

const PulsingIcon = ({ Icon, size }: PulsingIconProps) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prevPulse) => !prevPulse);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <Icon className={`text-${pulse ? 'neutral-300' : 'neutral-600'} animate-pulse`} size={size} />;
};

export default PulsingIcon;
