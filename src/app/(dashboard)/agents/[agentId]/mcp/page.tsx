export default function AgentMCPPage() {
    return (
        <div className="max-w-3xl">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-900 mb-1 font-semibold">Servidores MCP</h3>
                        <p className="text-sm text-gray-500">Conecta servidores Model Context Protocol</p>
                    </div>
                    <button className="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium cursor-pointer">
                        Agregar servidor
                    </button>
                </div>
                <div className="bg-white rounded-3xl p-12 border border-gray-200 flex flex-col items-center justify-center min-h-[300px]">
                    <div className="text-6xl mb-4">🖥️</div>
                    <p className="text-gray-500 font-medium">No hay servidores MCP conectados</p>
                </div>
            </div>
        </div>
    );
}
