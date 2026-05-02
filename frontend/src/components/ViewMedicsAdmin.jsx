import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdSearch, MdLocalHospital } from 'react-icons/md';
import { Size } from "../styles/styles";
import { ApprovedMedicCard } from "./ApprovedMedicCard";

const API = 'http://127.0.0.1:8000';

export const ViewMedicsAdmin = ({ medicosAprobados, onDeactivate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMedicos, setFilteredMedicos] = useState(medicosAprobados);
  const [deactivatedMedics, setDeactivatedMedics] = useState([]);

  const token = localStorage.getItem('token');

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredMedicos(medicosAprobados);
    } else {
      const filtered = medicosAprobados.filter((medico) => {
        const fullName = `${medico.nombre} ${medico.apellido}`.toLowerCase();
        const dpi = medico.dpi.toLowerCase();
        const correo = medico.correo.toLowerCase();
        const especialidad = medico.especialidad.toLowerCase();
        const colegiado = (medico.numero_colegiado || medico.no_colegiado || '').toLowerCase();
        return (
          fullName.includes(query) ||
          dpi.includes(query) ||
          correo.includes(query) ||
          especialidad.includes(query) ||
          colegiado.includes(query)
        );
      });
      setFilteredMedicos(filtered);
    }
  };

  const handleDeactivateMedic = async (medicId, razon) => {
    try {
      const res = await fetch(`${API}/api/admin/usuarios/medico/${medicId}/baja`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ razon_baja: razon })
      });

      if (!res.ok) {
        alert('Error al dar de baja');
        return;
      }

      const medico = filteredMedicos.find(m => m.id_medico === medicId);
      if (!medico) return;

      setDeactivatedMedics([
        ...deactivatedMedics,
        { ...medico, razon_baja: razon }
      ]);

      setFilteredMedicos(
        filteredMedicos.filter(m => m.id_medico !== medicId)
      );
    } catch (err) {
      console.error('Error al dar de baja médico:', err);
      alert('Error de conexión');
    }
  };

  const handleUpdateMedic = async (medicId, updatedData) => {
    try {
      const res = await fetch(`${API}/api/admin/usuarios/medico/${medicId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: updatedData.nombre,
          apellido: updatedData.apellido,
          genero: updatedData.genero,
          especialidad: updatedData.especialidad,
          numero_colegiado: updatedData.numero_colegiado || updatedData.no_colegiado
        })
      });

      if (!res.ok) {
        alert('Error al actualizar médico');
        return;
      }

      // Actualizar la lista localmente
      setFilteredMedicos(
        filteredMedicos.map(m =>
          m.id_medico === medicId ? updatedData : m
        )
      );
      alert('Médico actualizado correctamente');
    } catch (err) {
      console.error('Error al actualizar médico:', err);
      alert('Error de conexión');
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-md"
        >
          <div className="flex items-center gap-3 mb-4">
            <MdLocalHospital className="text-green-500 text-3xl" />
            <h2 className={`${Size.EXTRALARGE} font-bold text-gray-800`}>
              Ver Médicos
            </h2>
          </div>
          <p className={`${Size.MEDIUM} text-gray-600 mb-4`}>
            Gestiona los médicos aprobados en el sistema
          </p>

          <div className="flex gap-4">
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <p className={`${Size.MEDIUM} font-semibold text-green-600`}>
                {filteredMedicos.length} médicos activos
              </p>
            </div>
            {deactivatedMedics.length > 0 && (
              <div className="bg-red-50 px-4 py-2 rounded-lg">
                <p className={`${Size.MEDIUM} font-semibold text-red-600`}>
                  {deactivatedMedics.length} dados de baja
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 bg-white rounded-lg p-6 shadow-md"
      >
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 gap-3">
          <MdSearch className="text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Buscar por nombre, especialidad, DPI o correo..."
            value={searchQuery}
            onChange={handleSearch}
            className={`${Size.MEDIUM} w-full bg-transparent outline-none text-gray-700 placeholder-gray-400`}
          />
        </div>
      </motion.div>

      {/* Lista de médicos */}
      {filteredMedicos.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMedicos.map((medico, index) => (
            <motion.div
              key={medico.id_medico}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <ApprovedMedicCard
                medico={medico}
                onDeactivate={handleDeactivateMedic}
                onUpdate={handleUpdateMedic}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-12 shadow-md text-center"
        >
          <div className="text-gray-300 mb-4 text-6xl flex justify-center">
            👨‍⚕️
          </div>
          <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-2`}>
            No hay médicos
          </h3>
          <p className={`${Size.MEDIUM} text-gray-600`}>
            No se encontraron médicos aprobados o coincidentes
          </p>
        </motion.div>
      )}

      {/* Médicos dados de baja */}
      {deactivatedMedics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-lg p-6 shadow-md"
        >
          <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-4`}>
            Médicos Dados de Baja ({deactivatedMedics.length})
          </h3>
          <div className="space-y-2 text-sm">
            {deactivatedMedics.map((medico) => (
              <div
                key={medico.id_medico}
                className="p-3 rounded-lg bg-red-50 border-l-4 border-red-500"
              >
                <div className="font-semibold text-red-700">
                  Dr(a). {medico.nombre} {medico.apellido} - {medico.especialidad}
                </div>
                <div className="text-red-600 text-xs mt-1">
                  Motivo: {medico.razon_baja}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};