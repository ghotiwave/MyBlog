import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        {
          primary: 'bg-blue-600 text-white hover:bg-blue-700',
          secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
          ghost: 'text-gray-600 hover:bg-gray-100',
          danger: 'bg-red-600 text-white hover:bg-red-700',
        }[variant],
        {
          sm: 'px-3 py-1.5 text-sm',
          md: 'px-4 py-2 text-sm',
          lg: 'px-6 py-3 text-base',
        }[size],
        className
      )}
      {...props}
    />
  )
}
