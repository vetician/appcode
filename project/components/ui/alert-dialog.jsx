import React, { useState, forwardRef } from 'react';
import { buttonVariants } from '@/components/ui/button';

const AlertDialog = ({ children, open: propsOpen, onOpenChange, ...props }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = propsOpen !== undefined;
  const open = isControlled ? propsOpen : internalOpen;

  const handleOpenChange = (newOpen) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <div {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            open,
            onOpenChange: handleOpenChange
          });
        }
        return child;
      })}
    </div>
  );
};

const AlertDialogTrigger = forwardRef(({ children, onClick, open, onOpenChange, ...props }, ref) => {
  const handleClick = (e) => {
    if (onClick) onClick(e);
    onOpenChange(!open);
  };

  return React.cloneElement(children, {
    ref,
    onClick: handleClick,
    ...props
  });
});

const AlertDialogOverlay = forwardRef(({ className, open, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-black/80 transition-opacity',
        open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        className
      )}
      {...props}
    />
  );
});

const AlertDialogContent = forwardRef(({ 
  className, 
  children, 
  open, 
  onOpenChange, 
  ...props 
}, ref) => {
  return (
    <>
      <AlertDialogOverlay open={open} onClick={() => onOpenChange(false)} />
      <div
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg transition-all',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
          'sm:rounded-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
});

const AlertDialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className
    )}
    {...props}
  />
);

const AlertDialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);

const AlertDialogTitle = forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
));

const AlertDialogDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

const AlertDialogAction = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
));

const AlertDialogCancel = forwardRef(({ className, onClick, onOpenChange, ...props }, ref) => {
  const handleClick = (e) => {
    if (onClick) onClick(e);
    onOpenChange(false);
  };

  return (
    <button
      ref={ref}
      className={cn(
        buttonVariants({ variant: 'outline' }),
        'mt-2 sm:mt-0',
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
});

export {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};