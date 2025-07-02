'use client';

import * as React from 'react';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const DropdownMenuContext = React.createContext({
  open: false,
  setOpen: () => {},
  subOpen: false,
  setSubOpen: () => {}
});

const DropdownMenu = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [subOpen, setSubOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, subOpen, setSubOpen }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef(({ children, ...props }, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext);
  
  return React.cloneElement(children, {
    ref,
    onClick: (e) => {
      e.stopPropagation();
      setOpen(prev => !prev);
    },
    ...props
  });
});

const DropdownMenuContent = React.forwardRef(({ 
  className, 
  sideOffset = 4,
  ...props 
}, ref) => {
  const { open, setOpen } = React.useContext(DropdownMenuContext);
  const contentRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (contentRef.current && !contentRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

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
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        'absolute right-0 mt-2 origin-top-right animate-in fade-in-80',
        className
      )}
      style={{ marginTop: sideOffset }}
      {...props}
    />
  );
});

const DropdownMenuItem = React.forwardRef(({ 
  className, 
  inset = false,
  ...props 
}, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext);

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'transition-colors hover:bg-accent hover:text-accent-foreground',
        inset && 'pl-8',
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(false);
      }}
      {...props}
    />
  );
});

const DropdownMenuSubTrigger = React.forwardRef(({ 
  className, 
  inset = false,
  children,
  ...props 
}, ref) => {
  const { setSubOpen } = React.useContext(DropdownMenuContext);

  return (
    <div
      ref={ref}
      className={cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'transition-colors hover:bg-accent hover:text-accent-foreground',
        inset && 'pl-8',
        className
      )}
      onMouseEnter={() => setSubOpen(true)}
      onMouseLeave={() => setSubOpen(false)}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </div>
  );
});

const DropdownMenuSubContent = React.forwardRef(({ 
  className,
  ...props 
}, ref) => {
  const { subOpen } = React.useContext(DropdownMenuContext);
  const contentRef = React.useRef(null);

  if (!subOpen) return null;

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
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg',
        'absolute left-full top-0 ml-1 animate-in fade-in-80',
        className
      )}
      {...props}
    />
  );
});

const DropdownMenuCheckboxItem = React.forwardRef(({ 
  className, 
  children, 
  checked = false,
  ...props 
}, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext);

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
        'transition-colors hover:bg-accent hover:text-accent-foreground',
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(false);
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
});

const DropdownMenuRadioItem = React.forwardRef(({ 
  className, 
  children, 
  checked = false,
  ...props 
}, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext);

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
        'transition-colors hover:bg-accent hover:text-accent-foreground',
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(false);
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Circle className="h-2 w-2 fill-current" />}
      </span>
      {children}
    </div>
  );
});

const DropdownMenuLabel = React.forwardRef(({ 
  className, 
  inset = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'px-2 py-1.5 text-sm font-semibold',
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  );
});

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));

const DropdownMenuShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  );
};

// Set display names
DropdownMenu.displayName = 'DropdownMenu';
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';
DropdownMenuContent.displayName = 'DropdownMenuContent';
DropdownMenuItem.displayName = 'DropdownMenuItem';
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';
DropdownMenuLabel.displayName = 'DropdownMenuLabel';
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
};