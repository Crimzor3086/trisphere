'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';
import ConnectWalletButton from '@/components/ConnectWalletButton';

const navGroups = [
  {
    label: 'Intelligence',
    items: [
      { label: 'Dashboard', href: '/', icon: '◇' },
      { label: 'Trends', href: '/trends', icon: '↗' },
      { label: 'Hidden Champions', href: '/champions', icon: '◆' },
      { label: 'Insights', href: '/insights', icon: '◌' },
    ],
  },
  {
    label: 'Network',
    items: [
      { label: 'Matches', href: '/matches', icon: '⇄' },
      { label: 'Organizations', href: '/champions/registry', icon: '▣' },
      { label: 'Builders', href: '/profile', icon: '◎' },
    ],
  },
  {
    label: 'Trust & Ops',
    items: [
      { label: 'Registry', href: '/champions/registry', icon: '✓' },
      { label: 'AI Copilot', href: '/copilot', icon: '✦' },
      { label: 'Rewards', href: '/rewards', icon: '△' },
      { label: 'Profile', href: '/profile', icon: '◐' },
    ],
  },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-midnight text-foreground">
      <aside
        className={`fixed inset-y-0 left-0 z-50 hidden border-r border-border/70 bg-sidebar/95 backdrop-blur-xl transition-all duration-300 lg:block ${
          collapsed ? 'w-[88px]' : 'w-[280px]'
        }`}
      >
        <ShellNav collapsed={collapsed} pathname={pathname} onCollapse={() => setCollapsed((value) => !value)} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="h-full w-[min(86vw,320px)] border-r border-border/70 bg-sidebar" onClick={(event) => event.stopPropagation()}>
            <ShellNav collapsed={false} pathname={pathname} onCollapse={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-[88px]' : 'lg:pl-[280px]'}`}>
        <header className="sticky top-0 z-40 border-b border-border/70 bg-midnight/80 backdrop-blur-xl">
          <div className="flex min-h-[76px] items-center gap-4 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-2xl border border-border/80 bg-card/70 text-xl text-white lg:hidden"
              aria-label="Open navigation"
            >
              ≡
            </button>
            <div className="min-w-0 flex-1">
              <label htmlFor="global-search" className="sr-only">
                Search TriSphere
              </label>
              <div className="flex max-w-3xl items-center gap-3 rounded-2xl border border-border/70 bg-surface/70 px-4 py-3 text-sm shadow-xl shadow-black/10">
                <span className="text-muted">⌕</span>
                <input
                  id="global-search"
                  placeholder="Search trends, companies, people, matches, registry records, AI reports..."
                  className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted"
                />
                <span className="hidden rounded-lg border border-border/80 px-2 py-1 font-mono text-xs text-muted sm:inline">Ctrl K</span>
              </div>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <span className="rounded-2xl border border-success/30 bg-success/10 px-3 py-2 text-xs font-medium text-success">Live graph</span>
              <ConnectWalletButton />
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

function ShellNav({
  collapsed,
  pathname,
  onCollapse,
}: {
  collapsed: boolean;
  pathname: string;
  onCollapse: () => void;
}) {
  return (
    <div className="flex h-full flex-col px-4 py-5">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[18px] border border-primary/30 bg-primary/15 font-semibold text-primary shadow-glow">
            TS
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block text-base font-semibold text-white">TriSphere</span>
              <span className="block truncate text-xs text-muted">Opportunity Intelligence OS</span>
            </span>
          ) : null}
        </Link>
        <button
          type="button"
          onClick={onCollapse}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border/70 bg-surface/80 text-muted transition hover:text-white"
          aria-label="Toggle navigation"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className="mt-8 space-y-7">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed ? <p className="mb-2 px-3 text-xs font-medium uppercase tracking-[0.22em] text-muted">{group.label}</p> : null}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href as any}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${
                      active
                        ? 'border border-primary/30 bg-primary/10 text-white shadow-glow'
                        : 'border border-transparent text-muted hover:border-border/70 hover:bg-card/60 hover:text-white'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-surface/70 text-base">{item.icon}</span>
                    {!collapsed ? <span className="truncate">{item.label}</span> : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto rounded-[20px] border border-copilot/25 bg-copilot/10 p-4">
        {!collapsed ? (
          <>
            <p className="text-sm font-semibold text-white">AI daily brief</p>
            <p className="mt-2 text-xs leading-5 text-muted">7 new signals, 3 champion updates, 4 verified records.</p>
          </>
        ) : (
          <span className="grid h-8 place-items-center text-copilot">✦</span>
        )}
      </div>
    </div>
  );
}
