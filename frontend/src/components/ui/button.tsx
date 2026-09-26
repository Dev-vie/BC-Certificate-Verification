import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-98 cursor-pointer';

    const variants = {
      default: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/10 hover:shadow-lg hover:shadow-blue-500/20 active:bg-blue-800',
      outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground',
      link: 'text-blue-500 hover:underline underline-offset-4 bg-transparent p-0 active:scale-100',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-8 py-4 text-base rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
