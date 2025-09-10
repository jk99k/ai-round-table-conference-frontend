interface NeumorphismCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function NeumorphismCard({ children, className = '' }: NeumorphismCardProps) {
  return <div className={`neumorphism-card p-8 ${className}`}>{children}</div>;
}
