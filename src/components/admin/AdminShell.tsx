import Link from "next/link";

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-sand/15 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-light text-cream">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-metal">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex gap-3">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}

export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-sand/20 bg-peat/40 p-5 ${className}`}>{children}</div>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const styles = {
    primary: "bg-rust text-cream border-rust hover:bg-cream hover:text-ink",
    ghost: "bg-transparent text-cream border-sand/40 hover:border-cream",
    danger: "bg-transparent text-rust-light border-rust/50 hover:bg-rust hover:text-cream",
  };
  return (
    <button
      type="button"
      className={`inline-flex items-center border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminLinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const styles = {
    primary: "bg-rust text-cream border-rust hover:bg-cream hover:text-ink",
    ghost: "bg-transparent text-cream border-sand/40 hover:border-cream",
  };
  return (
    <Link
      href={href}
      className={`inline-flex items-center border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${styles[variant]}`}
    >
      {children}
    </Link>
  );
}

export function AdminInput({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-metal">
        {label}
      </span>
      <input
        className={`w-full border border-sand/25 bg-ink px-3 py-2 text-cream outline-none focus:border-rust ${className}`}
        {...props}
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-metal">
        {label}
      </span>
      <textarea
        className={`w-full border border-sand/25 bg-ink px-3 py-2 text-cream outline-none focus:border-rust ${className}`}
        {...props}
      />
    </label>
  );
}

export function AdminSelect({
  label,
  children,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-metal">
        {label}
      </span>
      <select
        className={`w-full border border-sand/25 bg-ink px-3 py-2 text-cream outline-none focus:border-rust ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
