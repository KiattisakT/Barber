import * as React from 'react'
import { cn } from '../../lib/utils'

type SwitchProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> & {
  checked?: boolean
}

export const Switch = ({ checked = false, className, ...props }: SwitchProps) => {
  return (
    <button
      aria-checked={checked}
      role="switch"
      type="button"
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2',
        checked ? 'border-confirmed bg-confirmed text-paper' : 'border-line bg-stone text-muted',
        className,
      )}
      {...props}
    >
      <span className={cn('h-5 w-5 rounded-full bg-paper shadow-sm shadow-ink/15 transition-transform', checked ? 'translate-x-5' : 'translate-x-0')} />
    </button>
  )
}
