import { Skeleton } from "@/components/ui/skeleton"

export default function AgentsLoading() {
    return (
        <div className="max-w-[1600px] mx-auto animate-fade-in p-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-48 rounded-xl" />
                    <Skeleton className="h-5 w-64 rounded-lg" />
                </div>
                <Skeleton className="h-12 w-48 rounded-2xl" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
                        {/* Avatar & Title */}
                        <div className="flex items-center gap-5">
                            <Skeleton className="w-16 h-16 rounded-2xl" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-6 w-3/4 rounded-lg" />
                                <Skeleton className="h-4 w-16 rounded-lg" />
                            </div>
                        </div>

                        {/* Stats Box */}
                        <div className="grid grid-cols-3 gap-4 bg-gray-50/50 rounded-3xl p-6 border border-gray-50">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex flex-col items-center space-y-2">
                                    <Skeleton className="w-8 h-8 rounded-lg" />
                                    <Skeleton className="h-5 w-8 rounded-md" />
                                    <Skeleton className="h-2.5 w-12 rounded-full" />
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <div className="flex -space-x-2">
                                <Skeleton className="w-8 h-8 rounded-full border-2 border-white" />
                                <Skeleton className="w-8 h-8 rounded-full border-2 border-white" />
                            </div>
                            <Skeleton className="h-5 w-32 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
