import { Loader2 } from 'lucide-react'

const sizeMap = {
  sm: 14,
  md: 16,
  lg: 24,
}

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <Loader2
      size={sizeMap[size]}
      className={`animate-spin shrink-0 ${className}`}
    />
  )
}
