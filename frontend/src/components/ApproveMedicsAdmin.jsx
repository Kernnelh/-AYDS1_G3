import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdSearch, MdPersonAdd } from 'react-icons/md';
import { Size } from "../styles/Styles";
import { PendingMedicCard } from "./PendingMedicCard";

export const ApproveMedicsAdmin = ({ medicosPendientes, onApprove, onReject }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMedicos, setFilteredMedicos] = useState(medicosPendientes);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredMedicos(medicosPendientes);
    } else {
      const filtered = medicosPendientes.filter((medico) => {
        const fullName = `${medico.nombre} ${medico.apellido}`.toLowerCase();
        const dpi = medico.dpi.toLowerCase();
        const correo = medico.correo.toLowerCase();
        const especialidad = medico.especialidad.toLowerCase();
        const colegiado = medico.numero_colegiado.toLowerCase();
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

  const handleApproveMedic = (medicId) => {
    onApprove(medicId);
    setFilteredMedicos(
      filteredMedicos.filter(m => m.id_medico !== medicId)
    );
  };

  const handleRejectMedic = (medicId) => {
    onReject(medicId);
    setFilteredMedicos(
      filteredMedicos.filter(m => m.id_medico !== medicId)
    );
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
            <MdPersonAdd className="text-blue-500 text-3xl" />
            <h2 className={`${Size.EXTRALARGE} font-bold text-gray-800`}>
              Aceptar Médicos
            </h2>
          </div>
          <p className={`${Size.MEDIUM} text-gray-600 mb-4`}>
            Revisa y aprueba las solicitudes de médicos pendientes
          </p>

          <div className="flex gap-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className={`${Size.MEDIUM} font-semibold text-blue-600`}>
                {filteredMedicos.length} pendientes
              </p>
            </div>
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
            placeholder="Buscar por nombre, DPI, especialidad o correo..."
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
              <PendingMedicCard
                medico={medico}
                onApprove={handleApproveMedic}
                onReject={handleRejectMedic}
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
            No hay médicos pendientes
          </h3>
          <p className={`${Size.MEDIUM} text-gray-600`}>
            Todos los médicos registrados han sido procesados
          </p>
        </motion.div>
      )}
    </div>
  );
};
