import Link from "next/link";

const links = [
  { href: "/collections", label: "Collections" },
  { href: "/journal", label: "Journal" },
  { href: "/for-architects", label: "For Architects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-cream/90 backdrop-blur-sm transition-[border-color] duration-300 [&.scrolled]:border-sand">
      <nav className="container flex h-16 items-center justify-between md:h-[4.5rem]">
        <Link href="/" className="serif text-lg tracking-wide md:text-xl">
          Lelek Studio
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-metal hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/collections" className="btn-text md:hidden">
          Works
        </Link>
      </nav>
    </header>
  );
}
