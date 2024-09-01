'use client'

import React from 'react'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';


function NavigationMenuComponent() {
    const { data: session, status } = useSession()
    return (
        <div className='fixed z-50 top-3 left-0 right-0 flex justify-center'>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href={'/'}>
                            <Image src={'/antler/Antler_logo.svg'} width={50} height={50} alt="Antler Image" />
                        </Link>
                    </NavigationMenuItem>
                    {status === 'loading' ?
                        <NavigationMenuItem>

                            <Skeleton className='h-8 w-16' />
                        </NavigationMenuItem>
                        : session?.user?.email ?
                            <NavigationMenuItem>

                                <Button onClick={() => signOut()} variant={"ghost"} className={navigationMenuTriggerStyle()}>

                                    Log out
                                </Button>
                            </NavigationMenuItem>
                            : null}



                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

export default NavigationMenuComponent