import React, { forwardRef } from 'react';

/**
 * Button Component
 * Reusable action button supporting primary, secondary, and ghost variants.
 * 
 * @param {Object} props
 * @param {'primary'|'secondary'|'ghost'} [props.variant='primary'] - Visual style variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {React.ReactNode} [props.icon] - Leading icon element
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.type='button'] - Button HTML type
 * @param {React.ReactNode} props.children - Button label / content
 */
const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

const VARIANTS = {
  primary:
    'bg-[#d4af37] text-[#0B0E14] font-semibold rounded-lg hover:brightness-110 hover:-translate-y-0.5 transition-all duration-200 shadow-sm active:translate-y-0',
  secondary:
    'border border-[#d4af37] text-[#d4af37] font-semibold rounded-lg hover:bg-[#d4af37] hover:text-[#0B0E14] transition-all duration-200 active:translate-y-0',
  ghost:
    'text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200',
};

const DISABLED_STYLES = 'opacity-50 cursor-not-allowed pointer-events-none hover:translate-y-0 hover:brightness-100';

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    disabled = false,
    icon = null,
    className = '',
    type = 'button',
    children,
    ...rest
  },
  ref
) {
  const sizeClasses = SIZES[size] || SIZES.md;
  const variantClasses = VARIANTS[variant] || VARIANTS.primary;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      className={`inline-flex items-center justify-center cursor-pointer select-none font-medium ${sizeClasses} ${variantClasses} ${
        disabled ? DISABLED_STYLES : ''
      } ${className}`.trim()}
      {...rest}
    >
      {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
