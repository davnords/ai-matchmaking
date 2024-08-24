"use client"

import { cn } from "@/lib/utils"
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from "react";
import { toast } from "sonner";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function LoginForm({ className, ...props }: UserAuthFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        console.log('Submitted')
        e.preventDefault();
        setLoading(true);

        const result = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password,
        });

        if (result?.ok) {
            toast.success('Login successful')
            router.refresh()
        }
        else {
            toast.error(result?.error)
        }

        setLoading(false);

    };

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center"
            >
                <div className="w-full flex-1">
                    <div className="w-full">
                        <div>
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
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
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Log in'}
                    </button>
                </div>
            </form>
        </div>
    )
}