import { getStatusColor } from '../../utils/helpers';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function StatusBadge({ status, className }) {
  const cn = (...inputs) => twMerge(clsx(inputs));
  
  return (
    <span className={cn(
      "px-2.5 py-1 text-xs font-semibold rounded-full",
      getStatusColor(status),
      className
    )}>
      {status}
    </span>
  );
}
