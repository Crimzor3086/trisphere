import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '/' as const },
  { label: 'Trends', href: '/trends' as const },
  { label: 'Champions', href: '/champions' as const },
  { label: 'Matches', href: '/matches' as const },
  { label: 'Insights', href: '/insights' as const },
  { label: 'Copilot', href: '/copilot' as const },
  { label: 'Rewards', href: '/rewards' as const },
  { label: 'Profile', href: '/profile' as const },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-3 text-base font-semibold text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300 shadow-sm shadow-sky-500/10">TS</span>
          TriSphere
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-medium text-slate-300 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <button className="rounded-full border border-slate-800/80 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white">
            Connect Wallet
          </button>
          <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
