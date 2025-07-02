'use client';

import * as React from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

const ResizableContext = React.createContext({
  direction: 'horizontal'
});

const ResizablePanelGroup = React.forwardRef(({ 
  className, 
  direction = 'horizontal',
  children, 
  ...props 
}, ref) => {
  return (
    <ResizableContext.Provider value={{ direction }}>
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full',
          direction === 'vertical' ? 'flex-col' : 'flex-row',
          className
        )}
        data-panel-group-direction={direction}
        {...props}
      >
        {children}
      </div>
    </ResizableContext.Provider>
  );
});
ResizablePanelGroup.displayName = 'ResizablePanelGroup';

const ResizablePanel = React.forwardRef(({ 
  className, 
  defaultSize = 50,
  minSize = 10,
  children, 
  ...props 
}, ref) => {
  const [size, setSize] = React.useState(defaultSize);
  
  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      style={{ flexBasis: `${size}%` }}
      {...props}
    >
      {children}
    </div>
  );
});
ResizablePanel.displayName = 'ResizablePanel';

const ResizableHandle = React.forwardRef(({ 
  withHandle = false, 
  className,
  ...props 
}, ref) => {
  const { direction } = React.useContext(ResizableContext);
  const [isDragging, setIsDragging] = React.useState(false);
  const handleRef = React.useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    // Implement resize logic here
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex items-center justify-center bg-border',
        direction === 'vertical' ? 'h-px w-full' : 'h-full w-px',
        isDragging && 'bg-primary',
        className
      )}
      onMouseDown={handleMouseDown}
      data-panel-group-direction={direction}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </div>
  );
});
ResizableHandle.displayName = 'ResizableHandle';

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };