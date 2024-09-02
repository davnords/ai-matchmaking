'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Share1Icon } from '@radix-ui/react-icons'
import React, { useTransition } from 'react'
import { sendRequestEmail } from './actions'
import { toast } from 'sonner'
import { IconSpinner } from '@/components/ui/icons'

function RequestAnswers({ otherUserEmail, currentUserEmail, requestId }: { otherUserEmail?: string, currentUserEmail?: string, requestId: string }) {
    const [isPending, startTransition] = useTransition()
    async function processRequest() {
        startTransition(async () => {
            if (otherUserEmail && currentUserEmail) {
                const response = await sendRequestEmail(otherUserEmail, currentUserEmail, requestId)
                if (response?.result === 'success') {
                    toast.success(response.message)
                } else {
                    toast.error(response.message)
                }
            }
        })
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button disabled={isPending} size={"sm"} variant={"outline"} className='flex flex-row space-x-1'>
                    {isPending ? <IconSpinner /> :
                        <>
                            <Share1Icon />
                            <span>
                                Request Answers
                            </span>
                        </>
                    }

                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Request answers from {otherUserEmail} </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will send an email to {otherUserEmail} requesting the answers to the track-out sheet.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isPending} onClick={processRequest} >Send</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default RequestAnswers