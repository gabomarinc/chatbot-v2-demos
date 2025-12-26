'use client';

import { useState } from 'react';
import { ConnectChannelModal } from './ConnectChannelModal';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewChannelButtonProps {
    className?: string;
    variant?: 'primary' | 'empty';
}

export function NewChannelButton({ className, variant = 'primary' }: NewChannelButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={cn(
                    "flex items-center gap-2 transition-all cursor-pointer active:scale-95",
                    variant === 'primary'
                        ? "px-5 py-3 bg-[#21AC96] text-white rounded-2xl text-sm font-bold shadow-lg shadow-[#21AC96]/20 hover:bg-[#1a8a78] group"
                        : "inline-flex items-center gap-2 px-6 py-3 bg-[#21AC96] text-white rounded-2xl text-sm font-bold shadow-lg shadow-[#21AC96]/20 hover:bg-[#1a8a78]",
                    className
                )}
            >
                <Plus className={cn("w-5 h-5", variant === 'primary' && "group-hover:rotate-90 transition-transform")} />
                {variant === 'primary' ? 'Conectar Nuevo Canal' : 'Añadir Canal'}
            </button>

            <ConnectChannelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
