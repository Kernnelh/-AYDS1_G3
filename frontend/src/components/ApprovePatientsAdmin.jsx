import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdSearch, MdDelete, MdPersonAdd } from 'react-icons/md';
import { Size } from "../styles/Styles";
import { PendingPatientCard } from "./PendingPatientCard";

export const ApprovePatientsAdmin = ({ pacientesPendientes, onApprove, onReject }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPacientes, setFilteredPacientes] = useState(pacientesPendientes);
  const [processedPatients, setProcessedPatients] = useState({});

  // Manejador de búsqueda
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredPacientes(pacientesPendientes);
    } else {
      const filtered = pacientesPendientes.filter((paciente) => {
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

  // Manejador para aceptar paciente
  const handleApprovePatient = (patientId) => {
    onApprove(patientId);
    setProcessedPatients({
      ...processedPatients,
      [patientId]: 'approved'
    });
    
    // Retirar el paciente de la lista
    setFilteredPacientes(
      filteredPacientes.filter(p => p.id_paciente !== patientId)
    );
  };

  // Manejador para rechazar paciente
  const handleRejectPatient = (patientId) => {
    onReject(patientId);
    setProcessedPatients({
      ...processedPatients,
      [patientId]: 'rejected'
    });
    
    // Retirar el paciente de la lista
    setFilteredPacientes(
      filteredPacientes.filter(p => p.id_paciente !== patientId)
    );
  };

  return (
    <div className="w-full">
      {/* Header de la sección */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-md"
        >
          <div className="flex items-center gap-3 mb-4">
            <MdPersonAdd className="text-blue-500 text-3xl" />
            <h2 className={`${Size.EXTRALARGE} font-bold text-gray-800`}>
              Aceptar Pacientes
            </h2>
          </div>
          <p className={`${Size.MEDIUM} text-gray-600 mb-4`}>
            Revisa y aprueba las solicitudes de pacientes pendientes
          </p>

          {/* Contador de pacientes pendientes */}
          <div className="flex gap-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className={`${Size.MEDIUM} font-semibold text-blue-600`}>
                {filteredPacientes.length} pendientes
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Barra de búsqueda */}
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

      {/* Lista de pacientes pendientes */}
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
              <PendingPatientCard
                paciente={paciente}
                onApprove={handleApprovePatient}
                onReject={handleRejectPatient}
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
            No hay pacientes pendientes
          </h3>
          <p className={`${Size.MEDIUM} text-gray-600`}>
            Todos los pacientes registrados han sido procesados
          </p>
        </motion.div>
      )}
    </div>
  );
};
