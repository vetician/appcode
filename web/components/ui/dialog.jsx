'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const DialogContext = React.createContext({
  open: false,
  setOpen: () => {}
});

const Dialog = ({ children, defaultOpen = false }) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = React.forwardRef(({ children, ...props }, ref) => {
  const { setOpen } = React.useContext(DialogContext);
  
  return React.cloneElement(children, {
    ref,
    onClick: () => setOpen(true),
    ...props
  });
});

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
  const { open } = React.useContext(DialogContext);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-black/80',
        'animate-in fade-in-0',
        className
      )}
      {...props}
    />
  );
});

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(DialogContext);
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
      <DialogOverlay onClick={() => setOpen(false)} />
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
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg',
          'animate-in fade-in-90 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]',
          'sm:rounded-lg',
          className
        )}
        {...props}
      >
        {children}
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
});

const DialogClose = React.forwardRef(({ children, ...props }, ref) => {
  const { setOpen } = React.useContext(DialogContext);
  
  return React.cloneElement(children, {
    ref,
    onClick: () => setOpen(false),
    ...props
  });
});

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
);

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

// Set display names
Dialog.displayName = 'Dialog';
DialogTrigger.displayName = 'DialogTrigger';
DialogOverlay.displayName = 'DialogOverlay';
DialogContent.displayName = 'DialogContent';
DialogClose.displayName = 'DialogClose';
DialogHeader.displayName = 'DialogHeader';
DialogFooter.displayName = 'DialogFooter';
DialogTitle.displayName = 'DialogTitle';
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
};