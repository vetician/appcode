'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const CommandContext = React.createContext({
  value: '',
  setValue: () => {},
  selectedValue: '',
  setSelectedValue: () => {}
});

const Command = React.forwardRef(({ className, children, ...props }, ref) => {
  const [value, setValue] = React.useState('');
  const [selectedValue, setSelectedValue] = React.useState('');

  return (
    <CommandContext.Provider value={{ value, setValue, selectedValue, setSelectedValue }}>
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
});

const CommandDialog = ({ children, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef(({ className, ...props }, ref) => {
  const { setValue } = React.useContext(CommandContext);

  return (
    <div className="flex items-center border-b px-3">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        onChange={(e) => setValue(e.target.value)}
        {...props}
      />
    </div>
  );
});

const CommandList = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  >
    {children}
  </div>
));

const CommandEmpty = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('py-6 text-center text-sm', className)}
    {...props}
  />
));

const CommandGroup = React.forwardRef(({ className, heading, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground',
      className
    )}
    {...props}
  >
    {heading && (
      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
        {heading}
      </div>
    )}
    {children}
  </div>
));

const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
));

const CommandItem = React.forwardRef(({ 
  className, 
  value, 
  children, 
  ...props 
}, ref) => {
  const { selectedValue, setSelectedValue } = React.useContext(CommandContext);
  const isSelected = selectedValue === value;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        isSelected ? "bg-accent text-accent-foreground" : "",
        className
      )}
      onClick={() => setSelectedValue(value)}
      {...props}
    >
      {children}
    </div>
  );
});

const CommandShortcut = ({ className, ...props }) => {
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

// Set display names
Command.displayName = 'Command';
CommandDialog.displayName = 'CommandDialog';
CommandInput.displayName = 'CommandInput';
CommandList.displayName = 'CommandList';
CommandEmpty.displayName = 'CommandEmpty';
CommandGroup.displayName = 'CommandGroup';
CommandItem.displayName = 'CommandItem';
CommandShortcut.displayName = 'CommandShortcut';
CommandSeparator.displayName = 'CommandSeparator';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};