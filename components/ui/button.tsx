import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border text-sm font-semibold uppercase tracking-[0.12em] ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'border-primary/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_40%),linear-gradient(135deg,rgba(38,28,17,0.92),rgba(8,8,8,0.96))] text-secondary shadow-[0_14px_34px_rgba(0,0,0,0.24)] hover:-translate-y-0.5 hover:border-secondary hover:text-white',
        destructive:
          'border-destructive/70 bg-destructive text-destructive-foreground shadow-[0_12px_26px_rgba(0,0,0,0.22)] hover:bg-destructive/90',
        outline:
          'border-secondary/80 bg-[linear-gradient(180deg,#f3ead9_0%,#e5d5b8_100%)] text-secondary-foreground shadow-[0_14px_30px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:brightness-105',
        secondary:
          'border-primary/30 bg-card text-card-foreground hover:border-primary/60 hover:text-secondary',
        ghost: 'border-transparent bg-transparent text-foreground hover:border-primary/20 hover:bg-primary/10 hover:text-secondary',
        link: 'border-transparent bg-transparent px-0 text-primary shadow-none hover:text-secondary hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-3.5 text-xs',
        lg: 'h-12 px-8 text-[0.95rem]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
