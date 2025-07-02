'use client';

import * as React from 'react';

const CollapsibleContext = React.createContext({
  open: false,
  setOpen: () => {}
});

const Collapsible = ({ children, defaultOpen = false }) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      {children}
    </CollapsibleContext.Provider>
  );
};

const CollapsibleTrigger = React.forwardRef(({ children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(CollapsibleContext);
  
  return React.cloneElement(children, {
    ref,
    onClick: () => setOpen(!open),
    'aria-expanded': open,
    ...props
  });
});

const CollapsibleContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(CollapsibleContext);
  const contentRef = React.useRef(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [open]);

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
      className={className}
      style={{
        overflow: 'hidden',
        transition: 'height 0.2s ease-in-out',
        height: open ? `${height}px` : '0px'
      }}
      {...props}
    >
      {children}
    </div>
  );
});

// Set display names
Collapsible.displayName = 'Collapsible';
CollapsibleTrigger.displayName = 'CollapsibleTrigger';
CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };