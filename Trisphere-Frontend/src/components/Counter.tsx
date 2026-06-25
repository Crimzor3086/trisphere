'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CounterProps {
  value: number;
  suffix?: string;
}

export default function Counter({ value, suffix = '' }: CounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.onChange((v) => setDisplayValue(v));
    animate(count, value, { duration: 1.5, delay: 0.3, ease: 'easeOut' });
    return () => unsubscribe();
  }, [value, count, rounded]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}