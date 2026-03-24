import { motion } from 'framer-motion';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { Size } from "../styles/Styles";

// Avatar por defecto
const DEFAULT_AVATAR = 'https://via.placeholder.com/200x200?text=Paciente';

export const PendingPatientCard = ({ paciente, onApprove, onReject }) => {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Función para calcular edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const ageDiff = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition w-full max-w-sm"
    >
      {/* Sección superior: Fotografía */}
      <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center border-b-4 border-blue-400">
        <img
          src={paciente.fotografia || DEFAULT_AVATAR}
          alt={`${paciente.nombre} ${paciente.apellido}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = DEFAULT_AVATAR;
          }}
        />
      </div>

      {/* Información del paciente */}
      <div className="p-6">
        {/* Nombre */}
        <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-3`}>
          {paciente.nombre} {paciente.apellido}
        </h3>

        {/* Información en dos columnas */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          {/* DPI */}
          <div>
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide">DPI</p>
            <p className="text-gray-700 font-semibold">{paciente.dpi}</p>
          </div>

          {/* Género */}
          <div>
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Género</p>
            <p className="text-gray-700 font-semibold">{paciente.genero}</p>
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Edad</p>
            <p className="text-gray-700 font-semibold">{calculateAge(paciente.fecha_nacimiento)} años</p>
          </div>

          {/* Correo */}
          <div>
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Nac.</p>
            <p className="text-gray-700 font-semibold text-xs">{formatDate(paciente.fecha_nacimiento)}</p>
          </div>
        </div>

        {/* Email */}
        <div className="mb-4 pb-4 border-t pt-4">
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-1">Correo Electrónico</p>
          <p className={`${Size.MEDIUM} text-blue-600 break-words`}>{paciente.correo}</p>
        </div>

        {/* Fecha de Registro */}
        <div className="mb-6 text-xs text-gray-500">
          <p>Solicitud recibida: {formatDate(paciente.fecha_registro)}</p>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3 w-full">
          {/* Botón Aceptar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onApprove(paciente.id_paciente)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#0094FF] to-[#00E0FF] text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition"
          >
            <MdCheckCircle className="text-lg" />
            <span>Aceptar</span>
          </motion.button>

          {/* Botón Rechazar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReject(paciente.id_paciente)}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 hover:shadow-lg transition"
          >
            <MdCancel className="text-lg" />
            <span>Rechazar</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
