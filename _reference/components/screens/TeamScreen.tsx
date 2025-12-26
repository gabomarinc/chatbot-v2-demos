import { Plus } from 'lucide-react';

export function TeamScreen() {
  const members = [
    { email: 'ana.garcia@ejemplo.com', role: 'Gerente', status: 'Activo' },
    { email: 'luis.perez@ejemplo.com', role: 'Entrenador', status: 'Activo' },
    { email: 'maria.lopez@ejemplo.com', role: 'Atendedor', status: 'Activo' },
    { email: 'carlos.ruiz@ejemplo.com', role: 'Atendedor', status: 'Pendiente' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Equipo</h1>
          <p className="text-gray-500">Gestiona los miembros de tu equipo</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Invitar miembro
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
        <button className="px-4 py-2 bg-white rounded-md text-sm text-gray-900 shadow-sm">
          Todos
        </button>
        <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
          Gerente
        </button>
        <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
          Entrenador
        </button>
        <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
          Atendedor
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs text-gray-600">Email</th>
              <th className="px-6 py-4 text-left text-xs text-gray-600">Rol</th>
              <th className="px-6 py-4 text-left text-xs text-gray-600">Status</th>
              <th className="px-6 py-4 text-right text-xs text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index} className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{member.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs ${
                      member.role === 'Gerente'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : member.role === 'Entrenador'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  >
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${
                      member.status === 'Activo'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Activo' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm text-purple-600 hover:text-purple-700">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
