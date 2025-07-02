'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const ScrollAreaContext = React.createContext({
  orientation: 'vertical'
});

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => {
  const [scrollbarWidth, setScrollbarWidth] = React.useState(0);
  const viewportRef = React.useRef(null);

  React.useEffect(() => {
    if (viewportRef.current) {
      // Calculate scrollbar width
      const scrollbarWidth = viewportRef.current.offsetWidth - viewportRef.current.clientWidth;
      setScrollbarWidth(scrollbarWidth);
    }
  }, []);

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <div
        ref={viewportRef}
        className="h-full w-full rounded-[inherit]"
        style={{
          paddingRight: scrollbarWidth,
          marginRight: -scrollbarWidth
        }}
      >
        {children}
      </div>
      <ScrollBar />
    </div>
  );
});
ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef(({ className, orientation = 'vertical', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical' &&
          'h-full w-2.5 border-l border-l-transparent p-[1px] absolute right-0 top-0',
        orientation === 'horizontal' &&
          'h-2.5 flex-col border-t border-t-transparent p-[1px] absolute bottom-0 left-0',
        className
      )}
      {...props}
    >
      <div className="relative flex-1 rounded-full bg-border" />
    </div>
  );
});
ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };