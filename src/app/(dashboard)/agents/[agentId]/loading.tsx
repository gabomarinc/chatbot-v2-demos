import { Skeleton } from "@/components/ui/skeleton"

export default function AgentDetailLoading() {
    return (
        <div className="max-w-[1600px] mx-auto animate-fade-in px-4 p-6">
            {/* Nav Skeleton */}
            <div className="mb-10">
                <Skeleton className="h-5 w-40 rounded-lg" />
            </div>

            {/* Header Card Skeleton */}
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm mb-10 relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                    <Skeleton className="w-28 h-28 rounded-[2rem] rotate-3" />

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-64 rounded-xl" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-1/2 rounded-lg" />

                        <div className="flex flex-wrap gap-8 pt-4">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center gap-3">
                                    <Skeleton className="w-12 h-12 rounded-2xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-2.5 w-10 rounded-full" />
                                        <Skeleton className="h-4 w-20 rounded-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
                {[1, 2, 3, 4, 5, 6, 7].map((t) => (
                    <Skeleton key={t} className="h-12 w-32 rounded-2xl shrink-0" />
                ))}
            </div>

            {/* Content Area Skeleton */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48 rounded-lg" />
                        <Skeleton className="h-4 w-64 rounded-lg" />
                    </div>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3, 4].map((f) => (
                        <div key={f} className="space-y-2">
                            <Skeleton className="h-4 w-32 rounded-md" />
                            <Skeleton className="h-12 w-full rounded-2xl" />
                        </div>
                    ))}
                    <div className="flex justify-end pt-4">
                        <Skeleton className="h-12 w-40 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
