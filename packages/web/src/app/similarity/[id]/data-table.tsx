"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import React, { useState, useTransition } from "react"

import { DataTablePagination } from "@/components/ui/Paginations"
import { SimilarityData } from "./page"
import { DataTableColumnHeader } from "@/components/ui/DataColumnHeader"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { User } from "@prisma/client"


interface DataTableProps<TData, TValue> {
    data: TData[]
    acceptedView: boolean
    otherUser?: User
}

interface TrackOutRow {
    question: string
    answer: string
}


export function DataTable<TData, TValue>({
    data,
    acceptedView,
    otherUser,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const columns: ColumnDef<SimilarityData>[] = [
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
                    badgeColor = "bg-green-700 hover:bg-green-500"
                } else if (score >= 60) {
                    badgeColor = "bg-green-500 hover:bg-green-300"
                } else if (score >= 50) {
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
            accessorKey: "answer",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Answer" />
            ),
            cell: ({ row }) => {
                if (acceptedView) {
                    const trackOutSheet = otherUser?.trackOutSheet as unknown as TrackOutRow[] | undefined
                    return (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Badge className="cursor-pointer" >View</Badge>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Answer</DialogTitle>
                                    <DialogDescription>
                                        {trackOutSheet?.find((q) => q.question === row.original.question)?.answer}
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    )
                }
                return (
                    <Badge aria-disabled={!acceptedView} >
                        Hidden
                    </Badge>
                )
            },
        },
    ]


    const table = useReactTable({
        data,
        columns: columns as any,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="hidden md:block mt-2">
                <DataTablePagination table={table} />
            </div>

        </div>
    )
}
