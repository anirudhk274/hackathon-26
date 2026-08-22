import React, { forwardRef } from 'react';

/**
 * Card Component
 * Container component supporting 'light' and 'dark' variants with optional hover effect.
 * 
 * @param {Object} props
 * @param {'light'|'dark'} [props.variant='light'] - Card theme variant
 * @param {boolean} [props.hover=false] - Whether to apply subtle hover elevation
 * @param {string} [props.padding='p-6'] - Inner padding class
 * @param {string} [props.className=''] - Additional Tailwind CSS classes
 * @param {React.ReactNode} props.children - Card contents
 */
const Card = forwardRef(function Card(
  {
    variant = 'light',
    hover = false,
    padding = 'p-6',
    className = '',
    children,
    ...rest
  },
  ref
) {
  const variantStyles =
    variant === 'dark'
      ? 'bg-[#162032] rounded-xl text-white'
      : 'bg-white rounded-xl border border-gray-100 shadow-sm';

  const hoverStyles = hover
    ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5'
    : '';

  return (
    <div
      ref={ref}
      className={`${variantStyles} ${padding} ${hoverStyles} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
