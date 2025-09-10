import Link from 'next/link';

interface NeumorphismLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NeumorphismLink({ href, children, className = '' }: NeumorphismLinkProps) {
  return (
    <Link href={href} className={`neumorphism-link px-4 py-2 text-sm font-medium ${className}`}>
      {children}
    </Link>
  );
}
