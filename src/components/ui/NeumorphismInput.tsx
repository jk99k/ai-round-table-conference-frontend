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
          className={`
            w-full px-4 py-3 neumorphism-input
            ${error ? 'error' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

NeumorphismInput.displayName = 'NeumorphismInput';

export default NeumorphismInput;
