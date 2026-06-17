import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-[8px] border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-ink text-paper',
        secondary: 'border-line bg-paper text-ink',
        outline: 'border-line text-ink',
        success: 'border-confirmed/30 bg-confirmed/10 text-confirmed',
        warning: 'border-copper/30 bg-copper/10 text-copper-dark',
        destructive: 'border-cancelled/30 bg-cancelled/10 text-cancelled',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>

export const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
