import LoadingArray from "@/components/ui/loading-array";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-24 ">
            <div className="z-10 w-full max-w-5xl items-center">
                <div className="flex flex-col space-y-1 mb-4">
                    <span className="text-xl font-semibold mb-2"><Skeleton className="h-4 w-[350px]" /></span>
                    <span className="text-base text-gray-500"><Skeleton className="h-4 w-[350px]" /></span>
                </div>
                <LoadingArray length={10} />
            </div>
        </main>

    )
}