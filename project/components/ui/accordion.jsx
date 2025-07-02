import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Accordion = ({ children, className, ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

const AccordionItem = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={className ? `border-b ${className}` : 'border-b'}
      {...props}
    >
      {children}
    </div>
  );
});

const AccordionTrigger = React.forwardRef(({ children, className, onClick, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e) => {
    setIsOpen(!isOpen);
    if (onClick) onClick(e);
  };

  return (
    <div className="flex">
      <button
        ref={ref}
        className={
          className
            ? `flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline ${className}`
            : 'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline'
        }
        onClick={handleClick}
        {...props}
      >
        {children}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
});

const AccordionContent = React.forwardRef(({ children, className, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  // This would ideally be controlled by the parent component or context
  // For simplicity, we're using local state here

  return (
    <div
      ref={ref}
      className={`overflow-hidden transition-all ${
        isOpen ? 'animate-accordion-down' : 'animate-accordion-up'
      }`}
      {...props}
    >
      <div className={className ? `pb-4 pt-0 ${className}` : 'pb-4 pt-0'}>
        {children}
      </div>
    </div>
  );
});

// CSS animations (should be added to your stylesheet)
// @keyframes accordion-down {
//   from { height: 0; opacity: 0; }
//   to { height: var(--radix-accordion-content-height); opacity: 1; }
// }

// @keyframes accordion-up {
//   from { height: var(--radix-accordion-content-height); opacity: 1; }
//   to { height: 0; opacity: 0; }
// }

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };