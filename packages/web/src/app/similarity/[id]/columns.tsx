"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/DataColumnHeader"
import { User } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { SimilarityData } from "./page"

export const columns: ColumnDef<SimilarityData>[] = [
    {
        accessorKey: "question",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Question" />
        ),
    },
    {
        accessorKey: "similarity",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Similarity score" />
        ),
        cell: ({ row }) => {
            if (!row.original.similarity) {
                return <></>
            }
            const score = row.original.similarity * 100
            let badgeColor = ""

            if (score >= 80) {
                badgeColor = "bg-green-500 hover:bg-green-300"
            } else if (score >= 60) {
                badgeColor = "bg-yellow-500 hover:bg-yellow-300"
            } else {
                badgeColor = "bg-red-500 hover:bg-red-300"
            }

            return (
                <Badge className={`${badgeColor} text-white`}>
                    {score.toFixed(1)}%
                </Badge>
            )
        },
    },
]