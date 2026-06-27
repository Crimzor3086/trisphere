import Link from 'next/link';
import ConnectWalletButton from '@/components/ConnectWalletButton';

const navItems = [
  { label: 'Home', href: '/' as const },
  { label: 'Trends', href: '/trends' as const },
  { label: 'Champions', href: '/champions' as const },
  { label: 'Matches', href: '/matches' as const },
  { label: 'Commerce', href: '/commerce' as const },
  { label: 'Insights', href: '/insights' as const },
  { label: 'Copilot', href: '/copilot' as const },
  { label: 'Rewards', href: '/rewards' as const },
  { label: 'Profile', href: '/profile' as const },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/80 bg-midnight/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-3 text-base font-semibold text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary shadow-sm shadow-primary/10">TS</span>
          TriSphere
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-medium text-foreground/80 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <ConnectWalletButton />
          <Link
            href="/matches"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-primary/90"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
