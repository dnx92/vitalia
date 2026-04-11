import * as React from 'react';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-xl',
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const showInitials = !src || imageError;

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-teal-500',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {showInitials ? (
          <span className="flex h-full w-full items-center justify-center font-semibold text-white">
            {name ? getInitials(name) : '?'}
          </span>
        ) : (
          <img
            src={src || undefined}
            alt={alt || name || 'Avatar'}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar };
