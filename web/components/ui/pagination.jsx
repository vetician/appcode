import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));

const PaginationLink = ({
  className,
  isActive = false,
  size = 'icon',
  disabled = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors';
  const sizeStyles = {
    icon: 'h-9 w-9',
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8'
  };
  
  const variantStyles = {
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    disabled: 'opacity-50 pointer-events-none'
  };

  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        baseStyles,
        sizeStyles[size],
        isActive ? variantStyles.outline : variantStyles.ghost,
        disabled && variantStyles.disabled,
        className
      )}
      {...props}
    />
  );
};

const PaginationPrevious = ({
  className,
  disabled = false,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    disabled={disabled}
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);

const PaginationNext = ({
  className,
  disabled = false,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    disabled={disabled}
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);

const PaginationEllipsis = ({ className, ...props }) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};