'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const DrawerContext = React.createContext({
  open: false,
  setOpen: () => {}
});

const Drawer = ({ children, defaultOpen = false }) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};

const DrawerTrigger = React.forwardRef(({ children, ...props }, ref) => {
  const { setOpen } = React.useContext(DrawerContext);
  
  return React.cloneElement(children, {
    ref,
    onClick: () => setOpen(true),
    ...props
  });
});

const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => {
  const { open, setOpen } = React.useContext(DrawerContext);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-black/80 transition-opacity',
        'animate-in fade-in-0',
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    />
  );
});

const DrawerContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(DrawerContext);
  const contentRef = React.useRef(null);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <>
      <DrawerOverlay />
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
          'fixed inset-x-0 bottom-0 z-50 h-auto max-h-[90vh] flex flex-col rounded-t-[10px] border bg-background',
          'animate-in slide-in-from-bottom',
          className
        )}
        {...props}
      >
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {children}
      </div>
    </>
  );
});

const DrawerClose = React.forwardRef(({ children, ...props }, ref) => {
  const { setOpen } = React.useContext(DrawerContext);
  
  return React.cloneElement(children, {
    ref,
    onClick: () => setOpen(false),
    ...props
  });
});

const DrawerHeader = ({ className, ...props }) => (
  <div
    className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
    {...props}
  />
);

const DrawerFooter = ({ className, ...props }) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
);

const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));

const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

// Set display names
Drawer.displayName = 'Drawer';
DrawerTrigger.displayName = 'DrawerTrigger';
DrawerOverlay.displayName = 'DrawerOverlay';
DrawerContent.displayName = 'DrawerContent';
DrawerClose.displayName = 'DrawerClose';
DrawerHeader.displayName = 'DrawerHeader';
DrawerFooter.displayName = 'DrawerFooter';
DrawerTitle.displayName = 'DrawerTitle';
DrawerDescription.displayName = 'DrawerDescription';

export {
  Drawer,
  DrawerTrigger,
  DrawerOverlay,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription
};