'use client';

import { useState } from 'react';

type ActionButtonProps = {
  action: string;
  doneLabel?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export default function ActionButton({
  action,
  doneLabel = 'Done',
  variant = 'secondary',
  className = '',
}: ActionButtonProps) {
  const [complete, setComplete] = useState(false);

  const base =
    'rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-default';
  const styles =
    variant === 'primary'
      ? 'bg-primary text-foreground hover:bg-primary/90 disabled:bg-success/20 disabled:text-success'
      : 'border border-border/80 text-foreground/90 hover:border-primary disabled:border-success/40 disabled:text-success';

  return (
    <button
      type="button"
      aria-pressed={complete}
      disabled={complete}
      onClick={() => setComplete(true)}
      className={`${base} ${styles} ${className}`}
    >
      {complete ? doneLabel : action}
    </button>
  );
}
