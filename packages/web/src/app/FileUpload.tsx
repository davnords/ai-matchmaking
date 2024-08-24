"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import ExcelJS from 'exceljs';
import { processExcelFile } from "./actions";
import { IconSpinner } from "@/components/ui/icons";
import { toast } from "sonner";

export function FileUploadDemo() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)

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

    return (
        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            {isLoading ?
                <div className="mt-4 flex flex-col items-center justify-center">
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {isLoading && (
                        <div className="flex flex-col space-y-2 items-center justify-center text-xl mt-24">
                            <span>Analyzing track out sheet</span>
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
    );
}