import * as React from 'react'
import { cn } from '../../lib/utils'

export const Label = ({ className, ...props }: React.ComponentProps<'label'>) => {
  return <label className={cn('block text-sm font-medium text-ink', className)} {...props} />
}
