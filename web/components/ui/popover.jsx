'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const PopoverContext = React.createContext({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
  align: 'center',
  sideOffset: 4
});

const Popover = ({ children, open: controlledOpen, defaultOpen = false, onOpenChange }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef(null);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const setOpen = (newOpen) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <PopoverContext.Provider value={{ 
      open, 
      setOpen,
      triggerRef,
      align: 'center',
      sideOffset: 4
    }}>
      {children}
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = React.forwardRef(({ children, ...props }, ref) => {
  const context = React.useContext(PopoverContext);
  
  return React.cloneElement(children, {
    ref: (node) => {
      context.triggerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    onClick: () => context.setOpen(!context.open),
    ...props
  });
});

const PopoverContent = React.forwardRef(({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}, ref) => {
  const context = React.useContext(PopoverContext);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const contentRef = React.useRef(null);

  React.useEffect(() => {
    if (context.open && context.triggerRef.current && contentRef.current) {
      const triggerRect = context.triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      
      let top = triggerRect.bottom + sideOffset;
      let left = triggerRect.left;

      // Basic alignment logic
      if (align === 'center') {
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      } else if (align === 'end') {
        left = triggerRect.right - contentRect.width;
      }

      // Adjust for window edges
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
        'z-50 fixed w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
        'animate-in fade-in-0 zoom-in-95',
        className
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
      {...props}
    />
  );
});

export { Popover, PopoverTrigger, PopoverContent };