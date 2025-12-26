"use client"

import { useState } from 'react';
import { Save } from 'lucide-react';

export default function SettingsPage() {
    const [workspaceName, setWorkspaceName] = useState('Mi Workspace');
    const [timezone, setTimezone] = useState('America/Panama');
    const [language, setLanguage] = useState('es');

    return (
        <div className="p-2">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-gray-900 mb-2 text-2xl font-semibold">Configuraciones</h1>
                <p className="text-gray-500">Gestiona la configuración de tu workspace y cuenta</p>
            </div>

            <div className="max-w-3xl space-y-6">
                {/* Workspace Settings */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                    <h2 className="text-gray-900 mb-6 text-lg font-semibold">Configuración del Workspace</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-700 mb-2 font-medium">Nombre del Workspace</label>
                            <input
                                type="text"
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2 font-medium">Zona horaria</label>
                            <select
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                                <option value="America/Panama">América/Panamá (UTC-5)</option>
                                <option value="America/Mexico_City">América/México (UTC-6)</option>
                                <option value="America/Bogota">América/Bogotá (UTC-5)</option>
                                <option value="America/Lima">América/Lima (UTC-5)</option>
                                <option value="America/Santiago">América/Santiago (UTC-3)</option>
                                <option value="America/Buenos_Aires">América/Buenos Aires (UTC-3)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2 font-medium">Idioma</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                                <option value="es">Español</option>
                                <option value="en">English</option>
                                <option value="pt">Português</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                    <h2 className="text-gray-900 mb-6 text-lg font-semibold">Configuración de la Cuenta</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-700 mb-2 font-medium">Email</label>
                            <input
                                type="email"
                                defaultValue="usuario@ejemplo.com"
                                disabled
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">El email no puede ser modificado</p>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2 font-medium">Cambiar contraseña</label>
                            <div className="space-y-3">
                                <input
                                    type="password"
                                    placeholder="Contraseña actual"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                                <input
                                    type="password"
                                    placeholder="Nueva contraseña"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirmar nueva contraseña"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium cursor-pointer">
                        <Save className="w-5 h-5" />
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
}

