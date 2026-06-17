import * as React from 'react'
import { cn } from '../../lib/utils'

export const Input = ({ className, type = 'text', ...props }: React.ComponentProps<'input'>) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-[8px] border border-line bg-paper px-3 text-sm text-ink shadow-none outline-none transition-colors placeholder:text-muted focus:border-copper focus:ring-2 focus:ring-copper/20 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
