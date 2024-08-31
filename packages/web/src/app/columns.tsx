"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/DataColumnHeader"
import { User } from "@prisma/client"
import { SimilarityMatching } from "./page"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export const columns: ColumnDef<SimilarityMatching>[] = [
    {
        accessorKey: "similarityScore",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Score" />
        ),
        cell: ({ row }) => {
            const score = row.original.similarityScore * 100
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
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            return (
                <Link href={`/similarity/${row.original.id}`}>
                    {row.original.name}
                </Link>
            )
        }
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ row }) => {
            return (
                <span>
                    {new Date(row.original.createdAt).toLocaleString('sv-SE')}
                </span>
            )
        }
    },
]