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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import React, { useState, useTransition } from "react"
import { Cross2Icon, UpdateIcon } from "@radix-ui/react-icons"
import { MoreHorizontal } from "lucide-react"
import { DataTableFacetedFilter } from "@/components/ui/DataTableFacetedFilter"
import { DataTablePagination } from "@/components/ui/Paginations"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "@prisma/client"
import { changeUserChoice, removeUserData, runStressTest } from "./actions"
import { IconSpinner } from "@/components/ui/icons"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    user: User,
}


export function DataTable<TData, TValue>({
    columns,
    data,
    user,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [isPending, startTransition] = useTransition()

    const table = useReactTable({
        data,
        columns,
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

    const isFiltered = table.getState().columnFilters.length > 0

    const handleBulkAction = (action: string) => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        startTransition(async () => {
            selectedRows.map(async (row: any) => {
                if (action === 'delete') {
                }
            })
        })
    }

    return (
        <div>
            <div className="flex items-center py-4">
                <div className="flex flex-row space-x-2 w-full items-center">
                    <Input
                        placeholder="Filter name..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => table.resetColumnFilters()}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset
                            <Cross2Icon className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="hidden md:block">
                    <div className="flex flex-row space-x-2 items-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div> {/* Wrapper div to make the Select triggerable */}
                                    <Select
                                        disabled={isPending}
                                        value={user.useComplementary ? 'true' : 'false'}
                                        onValueChange={(value) => {
                                            startTransition(async () => (
                                                await changeUserChoice(user.id, value === 'true')
                                            ))
                                        }}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a match type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Choose match type</SelectLabel>
                                                <SelectItem value="true">
                                                    {isPending ? <IconSpinner /> : 'Complementary'}
                                                </SelectItem>
                                                <SelectItem value="false">
                                                    {isPending ? <IconSpinner /> : 'Similar'}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Complementary is the default</p>
                            </TooltipContent>
                        </Tooltip>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button disabled={isPending} variant={"default"}>{isPending ? <IconSpinner /> :
                                    <div className="flex flex-row space-x-1 items-center">
                                        <UpdateIcon />
                                        <span>
                                            Update
                                        </span>
                                    </div>
                                }</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action will detele all your matches and require you to upload your track-out sheet again. This action is permanent.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                        startTransition(async () => {
                                            const result = await removeUserData(user.id)
                                            if (result.success) {
                                                toast.success(result.message)
                                            } else {
                                                toast.error(result.message)
                                            }
                                        })
                                    }}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter(
                                        (column) => column.getCanHide()
                                    )
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div >
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

        </div >
    )
}
