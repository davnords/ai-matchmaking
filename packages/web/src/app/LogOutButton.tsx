'use client'

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export default function LogOutButton() {
    return (
        <Button  onClick={() => signOut()}>Log out</Button>
    )
}