import { Skeleton } from "./skeleton"

export function SkeletonForm() {
    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8 animate-fade-in">
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
    );
}
