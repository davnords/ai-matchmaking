import React from 'react'
import Link from 'next/link';
import Image from "next/image"
import { LoginForm } from './LoginForm';

async function LoginPage() {
    return (
        <>
            <div className="container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 h-screen">
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
                    <div className="absolute inset-0 bg-zinc-900" />
                    <Image
                        alt='Antler image'
                        src='/antler/test.webp'
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-6 w-6"
                        >
                            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                        </svg>
                        Antler matchmaking
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                &ldquo;Find your perfect co-founder with AI.&rdquo;
                            </p>
                            <footer className="text-sm">Platform creator</footer>
                        </blockquote>
                    </div>
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Login
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Fill in your credentials below to log in
                            </p>
                        </div>
                        <LoginForm />
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            Dont have an account? {" "}
                            <Link
                                href="/signup"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Sign Up
                            </Link>{" "}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage