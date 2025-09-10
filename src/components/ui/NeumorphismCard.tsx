interface NeumorphismCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function NeumorphismCard({ children, className = '' }: NeumorphismCardProps) {
  return (
    <div
      className={`p-8 ${className}`}
      style={{
        background: '#f0f4f8',
        borderRadius: '16px',
        boxShadow: '8px 8px 16px #cfd8e3, -8px -8px 16px #ffffff',
      }}
    >
      {children}
    </div>
  );
}
