interface NeumorphismCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function NeumorphismCard({ children, className = '' }: NeumorphismCardProps) {
  return (
    <div
      className={`p-8 ${className}`}
      style={{
        background: '#e6e6e6',
        borderRadius: '16px',
        boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
      }}
    >
      {children}
    </div>
  );
}
