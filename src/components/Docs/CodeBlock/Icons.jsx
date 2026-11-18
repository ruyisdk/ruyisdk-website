import React from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

export const CopyIcon = () => <Copy size={15} strokeWidth={1.9} aria-hidden="true" />;

export const CopiedIcon = () => <Check size={15} strokeWidth={2.2} aria-hidden="true" />;

export const TerminalIcon = () => (
  <Terminal
    size={14}
    strokeWidth={2}
    aria-hidden="true"
    className="shrink-0 text-slate-500 dark:text-slate-400"
  />
);
