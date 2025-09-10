import Link from 'next/link';

interface NeumorphismLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NeumorphismLink({ href, children, className = '' }: NeumorphismLinkProps) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 text-sm font-medium ${className}`}
      style={{
        background: '#e6e6e6',
        color: '#374151',
        borderRadius: '8px',
        boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        display: 'inline-block',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.boxShadow = 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.boxShadow = '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff';
      }}
    >
      {children}
    </Link>
  );
}
