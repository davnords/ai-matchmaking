'use client'

import { Button } from "@/components/ui/button"
import { ExitIcon } from "@radix-ui/react-icons"
import { signOut } from "next-auth/react"


export default function LogOutButton() {
    return (
        <Button variant={"secondary"} onClick={() => signOut()}>
            <div className="flex flex-row space-x-1 items-center">
                <ExitIcon />
                <span>Log out</span>
            </div>

        </Button>
    )
}