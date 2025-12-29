'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteChannel } from '@/lib/actions/dashboard';
import { useRouter } from 'next/navigation';

interface DeleteChannelButtonProps {
    channelId: string;
    channelName: string;
    className?: string;
}

export function DeleteChannelButton({ channelId, channelName, className }: DeleteChannelButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        if (!showConfirm) {
            setShowConfirm(true);
            return;
        }

        setIsDeleting(true);
        try {
            await deleteChannel(channelId);
            router.refresh();
        } catch (error) {
            console.error('Error deleting channel:', error);
            alert('Error al eliminar el canal. Por favor, intenta de nuevo.');
        } finally {
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                    {isDeleting ? 'Eliminando...' : 'Confirmar'}
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={className || "p-2 hover:bg-red-50 rounded-xl transition-colors text-gray-400 hover:text-red-500"}
            title={`Eliminar canal ${channelName}`}
        >
            <Trash2 className="w-5 h-5" />
        </button>
    );
}

