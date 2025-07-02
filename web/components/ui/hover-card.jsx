'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const HoverCardContext = React.createContext({
  open: false,
  setOpen: () => {}
});

const HoverCard = ({ children, openDelay = 200, closeDelay = 200 }) => {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef(null);

  const handleOpenChange = (newOpen) => {
    clearTimeout(timeoutRef.current);
    
    if (newOpen) {
      timeoutRef.current = setTimeout(() => setOpen(true), openDelay);
    } else {
      timeoutRef.current = setTimeout(() => setOpen(false), closeDelay);
    }
  };

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <HoverCardContext.Provider value={{ open, setOpen: handleOpenChange }}>
      <div className="relative inline-block">
        {children}
      </div>
    </HoverCardContext.Provider>
  );
};

const HoverCardTrigger = React.forwardRef(({ children, ...props }, ref) => {
  const context = React.useContext(HoverCardContext);
  
  return React.cloneElement(children, {
    ref,
    onMouseEnter: () => context.setOpen(true),
    onMouseLeave: () => context.setOpen(false),
    ...props
  });
});

const HoverCardContent = React.forwardRef(({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}, ref) => {
  const context = React.useContext(HoverCardContext);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef(null);
  const contentRef = React.useRef(null);

  React.useEffect(() => {
    if (context.open && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      
      let top = triggerRect.bottom + sideOffset;
      let left = triggerRect.left;

      // Alignment logic
      if (align === 'center') {
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      } else if (align === 'end') {
        left = triggerRect.right - contentRect.width;
      }

      // Window edge collision detection
      if (left + contentRect.width > window.innerWidth) {
        left = window.innerWidth - contentRect.width - 5;
      }
      if (left < 0) left = 5;

      if (top + contentRect.height > window.innerHeight) {
        top = triggerRect.top - contentRect.height - sideOffset;
      }

      setPosition({ top, left });
    }
  }, [context.open, align, sideOffset]);

  if (!context.open) return null;

  return (
    <div
      ref={(node) => {
        contentRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn(
        'z-50 fixed w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
        'animate-in fade-in-0 zoom-in-95',
        className
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
      onMouseEnter={() => context.setOpen(true)}
      onMouseLeave={() => context.setOpen(false)}
      {...props}
    />
  );
});

// Set display names
HoverCard.displayName = 'HoverCard';
HoverCardTrigger.displayName = 'HoverCardTrigger';
HoverCardContent.displayName = 'HoverCardContent';

export { HoverCard, HoverCardTrigger, HoverCardContent };