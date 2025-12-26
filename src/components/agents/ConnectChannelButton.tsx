'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ConnectChannelModal } from '@/components/channels/ConnectChannelModal';

interface ConnectChannelButtonProps {
    className?: string;
    agentId?: string;
}

export function ConnectChannelButton({ className, agentId }: ConnectChannelButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center gap-2 px-6 py-3.5 bg-[#21AC96] text-white rounded-2xl text-sm font-bold shadow-lg shadow-[#21AC96]/20 hover:bg-[#1a8a78] transition-all active:scale-95 ${className || ''}`}
            >
                <Plus className="w-5 h-5" />
                Conectar Canal
            </button>

            <ConnectChannelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                agentId={agentId}
            />
        </>
    );
}

