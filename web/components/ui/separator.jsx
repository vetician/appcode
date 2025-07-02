'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import PropTypes from 'prop-types'; // Optional: only if you want runtime type checking

/**
 * A versatile separator component that can be used to visually separate content.
 * @param {object} props
 * @param {string} [props.orientation='horizontal'] - 'horizontal' or 'vertical'
 * @param {boolean} [props.decorative=true] - Whether the separator is decorative
 * @param {string} [props.className] - Additional className
 * @param {React.Ref} ref - React ref
 */
const Separator = React.forwardRef(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={!decorative ? orientation : undefined}
        className={cn(
          'shrink-0 bg-border',
          orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';

// Optional PropTypes (for runtime type checking)
Separator.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  decorative: PropTypes.bool,
  className: PropTypes.string,
};

export { Separator };