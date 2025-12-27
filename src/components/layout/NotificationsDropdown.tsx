'use client'

import { useState, useEffect, useRef } from 'react';
import { Bell, AlertCircle, Info, CheckCircle, X, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    type: 'warning' | 'info' | 'error' | 'success';
    title: string;
    message: string;
    actionUrl?: string;
    actionLabel?: string;
    createdAt: Date;
}

interface NotificationsDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    isLoading?: boolean;
}

export function NotificationsDropdown({ isOpen, onClose, notifications, isLoading = false }: NotificationsDropdownProps) {
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            case 'warning':
                return <AlertCircle className="w-4 h-4 text-yellow-600" />;
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'info':
                return <Info className="w-4 h-4 text-blue-600" />;
        }
    };

    const getBgColor = (type: Notification['type']) => {
        switch (type) {
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (notification.actionUrl) {
            router.push(notification.actionUrl);
            onClose();
        }
    };

    return (
        <div 
            ref={dropdownRef}
            className="absolute right-0 mt-3 w-96 bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#21AC96]/5 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#21AC96]/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-[#21AC96]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold text-gray-900">Notificaciones</h3>
                        <p className="text-xs text-gray-400 font-medium">
                            {notifications.length} {notifications.length === 1 ? 'notificación' : 'notificaciones'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                    <X className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            {/* Content */}
            <div className="max-h-[500px] overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#21AC96]"></div>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="p-2">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={cn(
                                    "p-4 rounded-2xl border mb-2 cursor-pointer transition-all hover:shadow-md group",
                                    notification.actionUrl ? "hover:scale-[1.02]" : "",
                                    getBgColor(notification.type)
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex-shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-extrabold text-gray-900 mb-1">
                                            {notification.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 font-medium mb-2">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                {format(new Date(notification.createdAt), 'd MMM HH:mm', { locale: es as any })}
                                            </span>
                                            {notification.actionUrl && (
                                                <div className="flex items-center gap-1 text-xs font-bold text-[#21AC96] group-hover:gap-2 transition-all">
                                                    <span>{notification.actionLabel || 'Ver más'}</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                            <Bell className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-sm font-bold text-gray-600 mb-1">No hay notificaciones</p>
                        <p className="text-xs text-gray-400">Estás al día con todas tus actividades</p>
                    </div>
                )}
            </div>
        </div>
    );
}

