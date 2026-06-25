'use client';

import { animate } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CounterProps {
  value: number;
  suffix?: string;
}

export default function Counter({ value, suffix = '' }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      delay: 0.3,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}
