'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef(({ 
  className, 
  value = 0,  // Default to 0 if undefined
  max = 100,  // Default max value
  ...props 
}, ref) => {
  // Ensure value stays within bounds
  const progressValue = Math.min(Math.max(value, 0), max);
  const percentage = (progressValue / max) * 100;

  return (
    <div
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
      role="progressbar"
      aria-valuenow={progressValue}
      aria-valuemin={0}
      aria-valuemax={max}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ 
          transform: `translateX(-${100 - percentage}%)`,
          width: `${percentage}%`
        }}
      />
    </div>
  );
});

Progress.displayName = 'Progress';

export { Progress };