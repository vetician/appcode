'use client';

import * as React from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const SelectContext = React.createContext(null);

const Select = ({
  children,
  value: propValue,
  defaultValue = '',
  onValueChange,
  open: propOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const value = propValue !== undefined ? propValue : internalValue;
  const open = propOpen !== undefined ? propOpen : internalOpen;

  const setValue = (newValue) => {
    if (propValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  };

  const setOpen = (newOpen) => {
    if (propOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <SelectContext.Provider value={{ value, setValue, open, setOpen }}>
      <div className="relative" data-disabled={disabled ? '' : undefined}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectGroup = ({ children }) => {
  return <div className="space-y-0.5">{children}</div>;
};

const SelectValue = ({ placeholder }) => {
  const context = React.useContext(SelectContext);
  return (
    <span className="truncate">
      {context?.value ? context.value : placeholder}
    </span>
  );
};

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  
  return (
    <div
      ref={ref}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className
      )}
      onClick={() => context?.setOpen(!context.open)}
      {...props}
    >
      {children || <SelectValue />}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </div>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </div>
));
SelectScrollUpButton.displayName = 'SelectScrollUpButton';

const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </div>
));
SelectScrollDownButton.displayName = 'SelectScrollDownButton';

const SelectContent = React.forwardRef(({ 
  className, 
  children, 
  position = 'popper', 
  ...props 
}, ref) => {
  const context = React.useContext(SelectContext);
  
  if (!context?.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
        position === 'popper' && 'translate-y-1',
        className
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <div className={cn('p-1', position === 'popper' && 'w-full')}>
        {children}
      </div>
      <SelectScrollDownButton />
    </div>
  );
});
SelectContent.displayName = 'SelectContent';

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = 'SelectLabel';

const SelectItem = React.forwardRef(({ 
  className, 
  children, 
  value, 
  disabled = false, 
  ...props 
}, ref) => {
  const context = React.useContext(SelectContext);
  
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onClick={() => !disabled && context?.setValue(value)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {context?.value === value && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
});
SelectItem.displayName = 'SelectItem';

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = 'SelectSeparator';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};