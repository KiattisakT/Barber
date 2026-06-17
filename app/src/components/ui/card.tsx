import * as React from 'react'
import { cn } from '../../lib/utils'

export const Card = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div className={cn('rounded-[8px] border border-line bg-paper text-ink', className)} {...props} />
}

export const CardHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div className={cn('flex flex-col gap-1.5 p-5', className)} {...props} />
}

export const CardTitle = ({ className, ...props }: React.ComponentProps<'h3'>) => {
  return <h3 className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
}

export const CardDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
  return <p className={cn('text-sm leading-6 text-muted', className)} {...props} />
}

export const CardContent = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div className={cn('p-5 pt-0', className)} {...props} />
}

export const CardFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div className={cn('flex items-center p-5 pt-0', className)} {...props} />
}
