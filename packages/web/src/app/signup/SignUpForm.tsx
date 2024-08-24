"use client"

import { useFormState, useFormStatus } from 'react-dom'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { cn, getMessageFromCode } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { IconSpinner } from '@/components/ui/icons'
import { signup } from './actions'


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
    const router = useRouter()
    const [result, dispatch] = useFormState(signup, undefined)

    useEffect(() => {
        if (result) {
            if (result.type === 'error') {
                toast.error(getMessageFromCode(result.resultCode))
            } else {
                toast.success(getMessageFromCode(result.resultCode))
                router.push('/')
            }
        }
    }, [result, router])


    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form
                action={dispatch}
                className="flex flex-col items-center gap-4 space-y-3"
            >
                <div className="w-full flex-1">
                    <div className="w-full">
                        <div>
                            <label
                                className="mb-3 block text-xs font-medium text-zinc-400"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                                htmlFor="email"
                            >
                                Name
                            </label>
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                                    id="name"
                                    type="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                                htmlFor="lösenord"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                    </div>
                    <SignUpButton />
                </div>
            </form>
        </div>
    )
}


function SignUpButton() {
    const { pending } = useFormStatus()

    return (
        <button
            className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            aria-disabled={pending}
            disabled={pending}
        >
            {pending ? <IconSpinner /> : 'Create account'}
        </button>
    )
}