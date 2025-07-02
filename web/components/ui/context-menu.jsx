'use client';

import * as React from 'react';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ContextMenuContext = React.createContext({
  open: false,
  setOpen: () => {},
  position: { x: 0, y: 0 },
  setPosition: () => {},
  subOpen: false,
  setSubOpen: () => {}
});

const ContextMenu = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [subOpen, setSubOpen] = React.useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  return (
    <ContextMenuContext.Provider value={{ 
      open, 
      setOpen, 
      position, 
      setPosition,
      subOpen,
      setSubOpen
    }}>
      <div onContextMenu={handleContextMenu}>
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
};

const ContextMenuTrigger = ({ children }) => {
  const { setOpen, setPosition } = React.useContext(ContextMenuContext);
  
  return React.cloneElement(children, {
    onContextMenu: (e) => {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setOpen(true);
    }
  });
};

const ContextMenuContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen, position } = React.useContext(ContextMenuContext);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
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
        menuRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        'fixed animate-in fade-in-80 zoom-in-95',
        className
      )}
      style={{
        left: position.x,
        top: position.y
      }}
      {...props}
    >
      {children}
    </div>
  );
});

const ContextMenuItem = React.forwardRef(({ 
  className, 
  inset = false,
  ...props 
}, ref) => {
  const { setOpen } = React.useContext(ContextMenuContext);

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

const ContextMenuSubTrigger = React.forwardRef(({ 
  className, 
  inset = false,
  children,
  ...props 
}, ref) => {
  const { setSubOpen } = React.useContext(ContextMenuContext);

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

const ContextMenuSubContent = React.forwardRef(({ 
  className,
  ...props 
}, ref) => {
  const { subOpen, position } = React.useContext(ContextMenuContext);
  const subMenuRef = React.useRef(null);

  if (!subOpen) return null;

  return (
    <div
      ref={(node) => {
        subMenuRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg',
        'fixed animate-in fade-in-80 zoom-in-95',
        className
      )}
      style={{
        left: position.x + 10,
        top: position.y
      }}
      {...props}
    />
  );
});

const ContextMenuCheckboxItem = React.forwardRef(({ 
  className, 
  children, 
  checked = false,
  ...props 
}, ref) => {
  const { setOpen } = React.useContext(ContextMenuContext);

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

const ContextMenuRadioItem = React.forwardRef(({ 
  className, 
  children, 
  checked = false,
  ...props 
}, ref) => {
  const { setOpen } = React.useContext(ContextMenuContext);

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

const ContextMenuLabel = React.forwardRef(({ 
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

const ContextMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
));

const ContextMenuShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  );
};

// Set display names
ContextMenu.displayName = 'ContextMenu';
ContextMenuTrigger.displayName = 'ContextMenuTrigger';
ContextMenuContent.displayName = 'ContextMenuContent';
ContextMenuItem.displayName = 'ContextMenuItem';
ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger';
ContextMenuSubContent.displayName = 'ContextMenuSubContent';
ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem';
ContextMenuRadioItem.displayName = 'ContextMenuRadioItem';
ContextMenuLabel.displayName = 'ContextMenuLabel';
ContextMenuSeparator.displayName = 'ContextMenuSeparator';
ContextMenuShortcut.displayName = 'ContextMenuShortcut';

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSubTrigger,
  ContextMenuSubContent
};