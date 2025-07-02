import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavigationMenuContext = React.createContext({
  activeItem: null,
  setActiveItem: () => {},
  open: false,
  setOpen: () => {}
});

const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => {
  const [activeItem, setActiveItem] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  return (
    <NavigationMenuContext.Provider value={{ activeItem, setActiveItem, open, setOpen }}>
      <nav
        ref={ref}
        className={cn(
          'relative z-10 flex max-w-max flex-1 items-center justify-center',
          className
        )}
        {...props}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
});

const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      'group flex flex-1 list-none items-center justify-center space-x-1',
      className
    )}
    {...props}
  />
));

const NavigationMenuItem = ({ children, value, ...props }) => {
  const context = React.useContext(NavigationMenuContext);
  
  return (
    <li 
      onMouseEnter={() => context.setActiveItem(value)}
      onMouseLeave={() => context.setActiveItem(null)}
      {...props}
    >
      {React.cloneElement(children, {
        isActive: context.activeItem === value
      })}
    </li>
  );
};

const navigationMenuTriggerStyle = (isActive) => cn(
  'inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors',
  'hover:bg-accent hover:text-accent-foreground',
  'focus:bg-accent focus:text-accent-foreground focus:outline-none',
  'disabled:pointer-events-none disabled:opacity-50',
  isActive ? 'bg-accent/50' : '',
);

const NavigationMenuTrigger = React.forwardRef(({ 
  className, 
  children, 
  isActive = false,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(navigationMenuTriggerStyle(isActive), 'group', className)}
      {...props}
    >
      {children}
      <ChevronDown
        className="relative top-[1px] ml-1 h-3 w-3 transition duration-200"
        aria-hidden="true"
      />
    </button>
  );
});

const NavigationMenuContent = React.forwardRef(({ 
  className, 
  align = 'center',
  ...props 
}, ref) => {
  const context = React.useContext(NavigationMenuContext);
  
  if (!context.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute left-0 top-full w-full rounded-md border bg-popover shadow-lg',
        'animate-in fade-in zoom-in-90',
        className
      )}
      {...props}
    />
  );
});

const NavigationMenuLink = React.forwardRef(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      'block px-4 py-2 text-sm hover:bg-accent',
      className
    )}
    {...props}
  />
));

const NavigationMenuViewport = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      'absolute left-0 top-full w-full overflow-hidden rounded-md border bg-popover shadow-lg',
      className
    )}
    {...props}
  />
));

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuViewport,
};