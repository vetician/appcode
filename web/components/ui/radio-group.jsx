'use client';

import * as React from 'react';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const RadioGroupContext = React.createContext({
  value: '',
  onValueChange: (value) => {}
});

const RadioGroup = React.forwardRef(({ 
  className, 
  value,
  defaultValue,
  onValueChange,
  children,
  ...props 
}, ref) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');

  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const currentValue = value !== undefined ? value : internalValue;

  return (
    <RadioGroupContext.Provider value={{
      value: currentValue,
      onValueChange: handleValueChange
    }}>
      <div
        ref={ref}
        className={cn('grid gap-2', className)}
        role="radiogroup"
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});
RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef(({ 
  className,
  value,
  disabled = false,
  children,
  ...props 
}, ref) => {
  const context = React.useContext(RadioGroupContext);
  const isChecked = context.value === value;

  return (
    <div className="flex items-center gap-2">
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isChecked}
        disabled={disabled}
        className={cn(
          'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        onClick={() => context.onValueChange(value)}
        {...props}
      >
        {isChecked && (
          <Circle className="h-2.5 w-2.5 fill-current text-current" />
        )}
      </button>
      {children && (
        <label 
          onClick={() => context.onValueChange(value)}
          className={disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        >
          {children}
        </label>
      )}
    </div>
  );
});
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };