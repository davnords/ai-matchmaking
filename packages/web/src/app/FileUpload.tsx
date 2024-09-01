"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import ExcelJS from 'exceljs';
import { processExcelFile } from "./actions";
import { IconSpinner } from "@/components/ui/icons";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BellRing, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function FileUploadDemo() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [firstOpen, setFirstOpen] = useState(true)

    const handleFileUpload = async (files: File[]) => {
        setError(null);

        if (files.length > 0) {
            const file = files[0];

            // Check if the file is an Excel file
            if (!file.name.match(/\.(xlsx|xls)$/)) {
                setError("Please upload an Excel file (.xlsx or .xls)");
                return;
            }

            try {
                setIsLoading(true)
                // Create a FormData object to send the file
                const formData = new FormData();
                formData.append("file", file);

                // Call the server action
                const result = await processExcelFile(formData);

                if (result.error) {
                    toast.error(result.error)
                } else {
                    toast.success('AI matchmaking complete...')
                }
            } catch (err) {
                setError("Error processing the Excel file");
                console.error(err);
            }
            setIsLoading(false)
        }
    };
    const requirements = [
        {
            title: "Download the track-out sheet and upload the .xlsx file.",
        },
        {
            title: "Do not add or remove rows/columns from the original track out sheet.",
        },
        {
            title: "Your answers should be in column D with questions in column C, the first answer should appear on row 14.",
        },
        {
            title: "By continuing you agree to store your data on our servers and embed your answers.",
        },
    ]


    return (
        <>
            <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                {isLoading ?
                    <div className="mt-4 flex flex-col items-center justify-center">
                        {error && <p className="text-red-500 text-center">{error}</p>}

                        {isLoading && (
                            <div className="flex flex-col space-y-2 items-center justify-center text-xl mt-24">
                                <span>Analyzing track out sheet</span>
                                <span className="text-sm text-muted-foreground">The results will be shown shortly...</span>
                                <IconSpinner className="w-8 h-8" />
                            </div>
                        )}
                    </div> :
                    <>
                        <FileUpload onChange={handleFileUpload} />

                        <div className="mt-4 flex flex-col items-center justify-center">
                            {error && <p className="text-red-500 text-center">{error}</p>}
                        </div>
                    </>
                }
            </div>
            <Dialog open={firstOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>How it works</DialogTitle>
                        <DialogDescription>
                            We scrape your track-out Excel sheet and rank your best matches using AI. Make sure to follow the requirements below.
                        </DialogDescription>
                    </DialogHeader>

                    <Card className={cn("w-[380px]")}>
                        <CardHeader>
                            <CardTitle>Requirements</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">

                            <div>
                                {requirements.map((requirement, index) => (
                                    <div
                                        key={index}
                                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                    >
                                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {requirement.title}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => setFirstOpen(false)} className="w-full">
                                <Check className="mr-2 h-4 w-4" /> I understand!
                            </Button>
                        </CardFooter>
                    </Card>
                </DialogContent>
            </Dialog>
        </>

    );
}