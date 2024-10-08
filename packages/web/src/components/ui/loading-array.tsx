import React from 'react'

function LoadingArray({ length }: { length: number }) {
    return (
        <div className="flex flex-col flex-1 space-y-4 overflow-auto">
            {Array.from({ length }).map((_, i) => (
                <div
                    key={i}
                    className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
                />
            ))}
        </div>
    )
}

export default LoadingArray