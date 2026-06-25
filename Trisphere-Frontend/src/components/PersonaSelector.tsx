'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const personas = [
  { label: 'Founder', description: 'Launch faster with founder-ready trend briefs.' },
  { label: 'Investor', description: 'Identify emerging sectors and fundraising signals.' },
  { label: 'Creator', description: 'Uncover viral topics and content hooks.' },
  { label: 'Operator', description: 'Find market entry points and operational insights.' },
  { label: 'Analyst', description: 'Deep data on trends, sectors, and verification.' },
  { label: 'Government', description: 'Policy signals and economic opportunity mapping.' },
  { label: 'Corporate', description: 'Strategic partnerships and market expansion.' },
];

export default function PersonaSelector() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {personas.map((persona) => (
        <motion.button
          key={persona.label}
          type="button"
          onClick={() => setSelected(persona.label)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`rounded-3xl border p-4 text-left text-sm transition-all duration-300 ${
            selected === persona.label
              ? 'border-sky-400 bg-sky-500/10'
              : 'border-slate-800/80 bg-slate-950/80 hover:border-sky-400 hover:bg-slate-900/90'
          }`}
        >
          <p className={`font-semibold ${selected === persona.label ? 'text-sky-300' : 'text-white'}`}>
            {persona.label}
          </p>
          <p className="mt-1 text-xs text-slate-500">{persona.description}</p>
        </motion.button>
      ))}
    </div>
  );
}
