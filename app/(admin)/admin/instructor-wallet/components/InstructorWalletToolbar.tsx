"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RotateCw } from "lucide-react"

import { useIsMobile } from "@/hooks/useMobile"
import { useEffect, useState } from "react"

interface InstructorWalletToolbarProps {
    searchValue: string
    onSearchChange: (value: string) => void
    onRefresh: () => void
    isFetching: boolean
}

export function InstructorWalletToolbar({
    searchValue,
    onSearchChange,
    onRefresh,
    isFetching,
}: InstructorWalletToolbarProps) {
    const isMobile = useIsMobile()
    const [inputValue, setInputValue] = useState(searchValue)

    useEffect(() => {
        setInputValue(searchValue)
    }, [searchValue])

    const handleSearch = () => {
        onSearchChange(inputValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <div className="sticky top-0 md:top-[42px] z-20 bg-white/95 backdrop-blur pb-4 pt-2 flex items-center gap-2 w-full">
            <div className="relative flex-1 min-w-0 max-w-sm">
                <Input
                    placeholder="Tìm kiếm theo email giảng viên..."
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pr-8 md:pr-10 h-9 bg-white border-slate-200 rounded-full shadow-sm w-full"
                />
                <Button
                    onClick={handleSearch}
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full"
                    variant="ghost"
                >
                    <Search className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </Button>
            </div>

            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full shrink-0 border-slate-200 shadow-sm bg-white ml-auto"
                onClick={onRefresh}
                disabled={isFetching}
            >
                <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
        </div>
    )
}
