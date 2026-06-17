import * as React from 'react'
import { cn } from '../../lib/utils'

type SeparatorProps = React.ComponentProps<'div'> & {
  orientation?: 'horizontal' | 'vertical'
}

export const Separator = ({ className, orientation = 'horizontal', ...props }: SeparatorProps) => {
  return (
    <div
      aria-orientation={orientation}
      role="separator"
      className={cn(orientation === 'horizontal' ? 'h-px w-full bg-line' : 'h-full w-px bg-line', className)}
      {...props}
    />
  )
}
