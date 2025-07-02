'use client';

import * as React from 'react';
import { Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

const OTPContext = React.createContext({
  value: '',
  setValue: () => {},
  activeIndex: 0,
  setActiveIndex: () => {},
  slots: [],
});

const InputOTP = React.forwardRef(({
  className,
  containerClassName,
  maxLength = 6,
  onChange,
  ...props
}, ref) => {
  const [value, setValue] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  const slots = Array(maxLength).fill(0).map((_, i) => ({
    char: value[i] || '',
    hasFakeCaret: activeIndex === i,
    isActive: activeIndex === i,
  }));

  const handleChange = (e) => {
    const newValue = e.target.value.slice(0, maxLength);
    setValue(newValue);
    onChange?.(newValue);
    setActiveIndex(Math.min(newValue.length, maxLength - 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && !value[activeIndex] && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <OTPContext.Provider value={{ value, setValue, activeIndex, setActiveIndex, slots }}>
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 has-[:disabled]:opacity-50',
          containerClassName
        )}
      >
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn('sr-only')} // Hide the actual input
          maxLength={maxLength}
          autoComplete="one-time-code"
          {...props}
        />
        <div className={cn('flex items-center', className)}>
          {props.children}
        </div>
      </div>
    </OTPContext.Provider>
  );
});

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
));

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const context = React.useContext(OTPContext);
  const slot = context.slots[index] || { char: '', hasFakeCaret: false, isActive: false };

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all',
        'first:rounded-l-md first:border-l last:rounded-r-md',
        slot.isActive && 'z-10 ring-2 ring-ring ring-offset-background',
        className
      )}
      onClick={() => context.setActiveIndex(index)}
      {...props}
    >
      {slot.char}
      {slot.hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});

const InputOTPSeparator = React.forwardRef((props, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
));

// Set display names
InputOTP.displayName = 'InputOTP';
InputOTPGroup.displayName = 'InputOTPGroup';
InputOTPSlot.displayName = 'InputOTPSlot';
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };