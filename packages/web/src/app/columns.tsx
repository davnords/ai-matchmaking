"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/DataColumnHeader"
import { User } from "@prisma/client"
import { SimilarityMatching } from "./page"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<SimilarityMatching>[] = [
    {
        accessorKey: "similarityScore",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Score" />
        ),
        cell: ({ row }) => {
            return <Badge>{(row.original.similarityScore*100).toFixed(0)}%</Badge>
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
]
