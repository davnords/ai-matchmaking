import * as React from "react"
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>
    title?: string
    options: {
        label: string
        value: string
        icon?: React.ComponentType<{ className?: string }>
    }[]
}

export function DataTableFacetedFilter<TData, TValue>({
    column,
    title,
    options,
}: DataTableFacetedFilterProps<TData, TValue>) {
    const facets = column?.getFacetedUniqueValues()
    const [selectedValues, setSelectedValues] = React.useState<Set<string>>(
        new Set(column?.getFilterValue() as string[])
    )

    const handleCheckboxChange = (checked: boolean, value: string) => {
        const newSelectedValues = new Set(selectedValues)
        if (checked) {
            newSelectedValues.add(value)
        } else {
            newSelectedValues.delete(value)
        }
        setSelectedValues(newSelectedValues)
        const filterValues = Array.from(newSelectedValues)
        column?.setFilterValue(
            filterValues.length ? filterValues : undefined
        )
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    {title}
                    {selectedValues.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedValues.has(option.value))
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 z-[999]" align="start">
                <ScrollArea className="p-1">
                    {options.map((option) => {
                        const isSelected = selectedValues.has(option.value)
                        return (
                            <div key={option.value} className="flex flex-row items-center space-x-2 hover:bg-accent py-2 px-2 rounded-md">
                                <Checkbox
                                    id={`filter-${option.value}`}
                                    checked={isSelected}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange(checked as boolean, option.value)
                                    }
                                />
                                <label
                                    htmlFor={`filter-${option.value}`}
                                    className="flex flex-row text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {option.icon && (
                                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground inline-block" />
                                    )}
                                    {option.label}
                                    {facets?.get(option.value) && (
                                        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                            {facets.get(option.value)}
                                        </span>
                                    )}
                                </label>
                            </div>
                        )
                    })}
                </ScrollArea>
                {selectedValues.size > 0 && (
                    <div className="p-2 border-t">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setSelectedValues(new Set())
                                column?.setFilterValue(undefined)
                            }}
                            className="w-full"
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}