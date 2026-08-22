import React from 'react';

/**
 * EmptyState Component
 * Displays a placeholder for empty data views with an icon, title, description, and optional action.
 * 
 * @param {Object} props
 * @param {React.ComponentType|React.ReactElement} props.icon - Lucide icon component or element
 * @param {string} props.title - Main title message
 * @param {string} [props.description] - Optional subtext or guidance
 * @param {React.ReactNode} [props.action] - Optional call to action element (e.g. Button)
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) {
  const renderIcon = () => {
    if (!Icon) return null;

    if (React.isValidElement(Icon)) {
      return React.cloneElement(Icon, {
        size: Icon.props.size || 48,
        className: `text-[#d4af37] opacity-60 ${Icon.props.className || ''}`.trim(),
        'aria-hidden': true,
      });
    }

    return <Icon size={48} className="text-[#d4af37] opacity-60" aria-hidden="true" />;
  };

  return (
    <div
      role="region"
      aria-label={title || 'Empty state'}
      className={`flex flex-col items-center justify-center text-center p-8 ${className}`.trim()}
    >
      {Icon && (
        <div className="mb-4 flex items-center justify-center">
          {renderIcon()}
        </div>
      )}

      {title && (
        <h3 className="text-gray-500 font-medium text-base mb-1">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-gray-400 text-sm max-w-sm mb-4">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
