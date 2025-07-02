'use client';

import * as React from 'react';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MenubarContext = React.createContext({
  openMenu: null,
  setOpenMenu: () => {},
  subOpen: null,
  setSubOpen: () => {}
});

const Menubar = React.forwardRef(({ className, children, ...props }, ref) => {
  const [openMenu, setOpenMenu] = React.useState(null);
  const [subOpen, setSubOpen] = React.useState(null);

  return (
    <MenubarContext.Provider value={{ openMenu, setOpenMenu, subOpen, setSubOpen }}>
      <div
        ref={ref}
        className={cn(
          'flex h-10 items-center space-x-1 rounded-md border bg-background p-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </MenubarContext.Provider>
  );
});

const MenubarMenu = ({ value, children }) => {
  const context = React.useContext(MenubarContext);
  const isOpen = context.openMenu === value;

  return (
    <div 
      className="relative"
      onMouseEnter={() => context.setOpenMenu(value)}
      onMouseLeave={() => context.setOpenMenu(null)}
    >
      {React.Children.map(children, child => 
        React.cloneElement(child, { isOpen })
      )}
    </div>
  );
};

const MenubarTrigger = React.forwardRef(({ 
  className, 
  isOpen = false,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        isOpen ? 'bg-accent text-accent-foreground' : '',
        className
      )}
      {...props}
    />
  );
});

const MenubarContent = React.forwardRef(({ 
  className, 
  isOpen,
  align = 'start',
  ...props 
}, ref) => {
  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        'animate-in fade-in-0 zoom-in-95',
        align === 'start' ? 'left-0' : 'right-0',
        className
      )}
      {...props}
    />
  );
});

const MenubarItem = React.forwardRef(({ 
  className, 
  inset = false,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        inset ? 'pl-8' : '',
        className
      )}
      {...props}
    />
  );
});

const MenubarSubTrigger = React.forwardRef(({ 
  className, 
  children,
  inset = false,
  ...props 
}, ref) => {
  const context = React.useContext(MenubarContext);
  
  return (
    <button
      ref={ref}
      className={cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        inset ? 'pl-8' : '',
        className
      )}
      onMouseEnter={() => context.setSubOpen(true)}
      onMouseLeave={() => context.setSubOpen(false)}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </button>
  );
});

const MenubarSubContent = React.forwardRef(({ 
  className,
  isSubOpen,
  ...props 
}, ref) => {
  if (!isSubOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute left-full top-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground',
        'animate-in fade-in-0 zoom-in-95',
        className
      )}
      {...props}
    />
  );
});

const MenubarCheckboxItem = React.forwardRef(({ 
  className, 
  children, 
  checked = false,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </button>
  );
});

const MenubarRadioItem = React.forwardRef(({ 
  className, 
  children, 
  checked = false,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Circle className="h-2 w-2 fill-current" />}
      </span>
      {children}
    </button>
  );
});

const MenubarLabel = React.forwardRef(({ 
  className, 
  inset = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'px-2 py-1.5 text-sm font-semibold',
        inset ? 'pl-8' : '',
        className
      )}
      {...props}
    />
  );
});

const MenubarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));

const MenubarShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className
      )}
      {...props}
    />
  );
};

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarShortcut
};