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
    <div className="admin-shell">
      <div className="admin-shell-head">
        <div>
          <h1>{title}</h1>
          {subtitle ? <p className="admin-shell-sub">{subtitle}</p> : null}
        </div>
        {actions ? <div className="admin-shell-actions">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`admin-card ${className}`.trim()} style={style}>
      {children}
    </div>
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
  const variantClass =
    variant === "primary" ? "filled" : variant === "ghost" ? "ghost" : "danger";
  return (
    <button type="button" className={`admin-btn ${variantClass} ${className}`.trim()} {...props}>
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
  const variantClass = variant === "primary" ? "filled" : "ghost";
  return (
    <Link href={href} className={`admin-btn ${variantClass}`}>
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
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      <input className={`admin-field-input ${className}`.trim()} {...props} />
    </label>
  );
}

export function AdminTextarea({
  label,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      <textarea className={className} {...props} />
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
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      <select className={className} {...props}>
        {children}
      </select>
    </label>
  );
}
