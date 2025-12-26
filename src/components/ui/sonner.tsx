"use client"

import * as React from "react"

// Simple toast implementation
let toastCallback: ((message: { title?: string; description?: string; variant?: string }) => void) | null = null

function showToast({ title, description, variant }: { title?: string; description?: string; variant?: string }) {
    if (toastCallback) {
        toastCallback({ title, description, variant })
    }
}

export const toast = {
    success: (message: string) => showToast({ title: message, variant: 'success' }),
    error: (message: string) => showToast({ title: message, variant: 'destructive' }),
    info: (message: string) => showToast({ title: message, variant: 'default' }),
}

export function Toaster() {
    const [toasts, setToasts] = React.useState<Array<{ id: number; title?: string; description?: string; variant?: string }>>([])
    const idCounter = React.useRef(0)

    React.useEffect(() => {
        toastCallback = ({ title, description, variant }) => {
            const id = idCounter.current++
            setToasts(prev => [...prev, { id, title, description, variant }])
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id))
            }, 3000)
        }
        return () => {
            toastCallback = null
        }
    }, [])

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`rounded-lg border p-4 shadow-lg min-w-[300px] ${toast.variant === 'destructive'
                            ? 'bg-red-50 border-red-200 text-red-900'
                            : toast.variant === 'success'
                                ? 'bg-green-50 border-green-200 text-green-900'
                                : 'bg-white border-slate-200'
                        }`}
                >
                    {toast.title && <div className="font-semibold">{toast.title}</div>}
                    {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
                </div>
            ))}
        </div>
    )
}
