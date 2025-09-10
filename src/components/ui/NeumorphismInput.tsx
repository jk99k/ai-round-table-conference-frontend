import { forwardRef } from 'react';

interface NeumorphismInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const NeumorphismInput = forwardRef<HTMLInputElement, NeumorphismInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <input
          ref={ref}
          className={`w-full px-4 py-3 ${className}`}
          style={{
            background: '#f0f4f8',
            border: 'none',
            borderRadius: '12px',
            boxShadow: error
              ? 'inset 4px 4px 8px #ff6b6b, inset -4px -4px 8px #ffffff'
              : 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
            transition: 'all 0.2s ease',
            outline: 'none',
          }}
          onFocus={(e) => {
            if (!error) {
              e.target.style.boxShadow = 'inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff';
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.target.style.boxShadow = 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff';
            }
          }}
          {...props}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

NeumorphismInput.displayName = 'NeumorphismInput';

export default NeumorphismInput;
