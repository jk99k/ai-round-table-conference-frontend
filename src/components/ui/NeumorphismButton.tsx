interface NeumorphismButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function NeumorphismButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: NeumorphismButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: '#3b82f6',
          color: 'white',
          boxShadow: '4px 4px 8px #3b82f6, -4px -4px 8px #60a5fa',
        };
      case 'secondary':
        return {
          background: '#e6e6e6',
          color: '#374151',
          boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
        };
      case 'danger':
        return {
          background: '#ef4444',
          color: 'white',
          boxShadow: '4px 4px 8px #ef4444, -4px -4px 8px #f87171',
        };
      default:
        return {
          background: '#3b82f6',
          color: 'white',
          boxShadow: '4px 4px 8px #3b82f6, -4px -4px 8px #60a5fa',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '8px 12px', fontSize: '14px' };
      case 'md':
        return { padding: '12px 24px', fontSize: '16px' };
      case 'lg':
        return { padding: '16px 32px', fontSize: '18px' };
      default:
        return { padding: '12px 24px', fontSize: '16px' };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <button
      className={`font-medium ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{
        border: 'none',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        ...variantStyles,
        ...sizeStyles,
      }}
      onMouseEnter={(e) => {
        const target = e.target as HTMLButtonElement;
        if (variant === 'primary') {
          target.style.boxShadow = '6px 6px 12px #3b82f6, -6px -6px 12px #60a5fa';
        } else if (variant === 'secondary') {
          target.style.boxShadow = '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff';
        } else if (variant === 'danger') {
          target.style.boxShadow = '6px 6px 12px #ef4444, -6px -6px 12px #f87171';
        }
      }}
      onMouseLeave={(e) => {
        const target = e.target as HTMLButtonElement;
        target.style.boxShadow = variantStyles.boxShadow;
      }}
      onMouseDown={(e) => {
        const target = e.target as HTMLButtonElement;
        if (variant === 'primary') {
          target.style.boxShadow = 'inset 4px 4px 8px #3b82f6, inset -4px -4px 8px #60a5fa';
        } else if (variant === 'secondary') {
          target.style.boxShadow = 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff';
        } else if (variant === 'danger') {
          target.style.boxShadow = 'inset 4px 4px 8px #ef4444, inset -4px -4px 8px #f87171';
        }
      }}
      onMouseUp={(e) => {
        const target = e.target as HTMLButtonElement;
        target.style.boxShadow = variantStyles.boxShadow;
      }}
      {...props}
    >
      {children}
    </button>
  );
}
