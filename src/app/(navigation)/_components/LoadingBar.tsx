import { Loader2 } from 'lucide-react'
import React from 'react'

type LoadingBarProps = {
  isLoading: boolean
}

function LoadingBar({ isLoading }: LoadingBarProps) {
  if (!isLoading) return null

  return (
    <div className='absolute top-0 left-0 right-0 w-full h-auto z-40 flex flex-col justify-center items-center gap-2'>
    <div className="w-full h-[4px] animate-pulse bg-secondary drop-shadow-secondary drop-shadow-lg"></div>
    <div className='rounded-full flex flex-row justify-center items-center gap-2 bg-marker-background text-secondary px-3 py-1 w-fit shadow-xl'>
        <Loader2 className='text-secondary size-4 animate-spin'/>
        <span className='text-xs'>Loading route...</span></div>
    </div>
  )
}

export default LoadingBar
