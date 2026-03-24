import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdSearch, MdPeople } from 'react-icons/md';
import { Size } from "../styles/Styles";
import { ApprovedPatientCard } from "./ApprovedPatientCard";

export const ViewPatientsAdmin = ({ pacientesAprobados, onDeactivate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPacientes, setFilteredPacientes] = useState(pacientesAprobados);
  const [deactivatedPatients, setDeactivatedPatients] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredPacientes(pacientesAprobados);
    } else {
      const filtered = pacientesAprobados.filter((paciente) => {
        const fullName = `${paciente.nombre} ${paciente.apellido}`.toLowerCase();
        const dpi = paciente.dpi.toLowerCase();
        const correo = paciente.correo.toLowerCase();
        return (
          fullName.includes(query) ||
          dpi.includes(query) ||
          correo.includes(query)
        );
      });
      setFilteredPacientes(filtered);
    }
  };

  const handleDeactivatePatient = (pacienteId, razon) => {
    const paciente = filteredPacientes.find(p => p.id_paciente === pacienteId);
    if (!paciente) return;

    console.log(`Paciente dado de baja: ${paciente.nombre}, Motivo: ${razon}`);
    onDeactivate(pacienteId, razon);
    
    setDeactivatedPatients([
      ...deactivatedPatients,
      { ...paciente, razon_baja: razon }
    ]);

    setFilteredPacientes(
      filteredPacientes.filter(p => p.id_paciente !== pacienteId)
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
            <MdPeople className="text-green-500 text-3xl" />
            <h2 className={`${Size.EXTRALARGE} font-bold text-gray-800`}>
              Ver Pacientes
            </h2>
          </div>
          <p className={`${Size.MEDIUM} text-gray-600 mb-4`}>
            Gestiona los pacientes aprobados en el sistema
          </p>

          <div className="flex gap-4">
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <p className={`${Size.MEDIUM} font-semibold text-green-600`}>
                {filteredPacientes.length} pacientes activos
              </p>
            </div>
            {deactivatedPatients.length > 0 && (
              <div className="bg-red-50 px-4 py-2 rounded-lg">
                <p className={`${Size.MEDIUM} font-semibold text-red-600`}>
                  {deactivatedPatients.length} dados de baja
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
            placeholder="Buscar por nombre, DPI o correo..."
            value={searchQuery}
            onChange={handleSearch}
            className={`${Size.MEDIUM} w-full bg-transparent outline-none text-gray-700 placeholder-gray-400`}
          />
        </div>
      </motion.div>

      {/* Lista de pacientes */}
      {filteredPacientes.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPacientes.map((paciente, index) => (
            <motion.div
              key={paciente.id_paciente}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <ApprovedPatientCard
                paciente={paciente}
                onDeactivate={handleDeactivatePatient}
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
            👥
          </div>
          <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-2`}>
            No hay pacientes
          </h3>
          <p className={`${Size.MEDIUM} text-gray-600`}>
            No se encontraron pacientes aprobados o coincidentes
          </p>
        </motion.div>
      )}

      {/* Pacientes dados de baja */}
      {deactivatedPatients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-lg p-6 shadow-md"
        >
          <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-4`}>
            Pacientes Dados de Baja ({deactivatedPatients.length})
          </h3>
          <div className="space-y-2 text-sm">
            {deactivatedPatients.map((paciente) => (
              <div
                key={paciente.id_paciente}
                className="p-3 rounded-lg bg-red-50 border-l-4 border-red-500"
              >
                <div className="font-semibold text-red-700">
                  {paciente.nombre} {paciente.apellido}
                </div>
                <div className="text-red-600 text-xs mt-1">
                  Motivo: {paciente.razon_baja}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
