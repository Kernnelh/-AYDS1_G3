import { motion } from 'framer-motion';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { Size } from "../styles/Styles";

const DEFAULT_AVATAR = 'https://via.placeholder.com/200x200?text=Doctor';

export const PendingMedicCard = ({ medico, onApprove, onReject }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition w-full max-w-sm"
    >
      {/* Fotografía */}
      <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center border-b-4 border-blue-400">
        <img
          src={medico.fotografia || DEFAULT_AVATAR}
          alt={`${medico.nombre} ${medico.apellido}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = DEFAULT_AVATAR;
          }}
        />
      </div>

      {/* Información */}
      <div className="p-6">
        {/* Nombre */}
        <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-3`}>
          Dr(a). {medico.nombre} {medico.apellido}
        </h3>

        {/* Grid de información */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          {/* DPI */}
          <div>
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide">DPI</p>
            <p className="text-gray-700 font-semibold">{medico.dpi}</p>
          </div>

          {/* Género */}
          <div>
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Género</p>
            <p className="text-gray-700 font-semibold">{medico.genero}</p>
          </div>

          {/* Especialidad */}
          <div className="col-span-2">
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Especialidad</p>
            <p className="text-blue-600 font-semibold">{medico.especialidad}</p>
          </div>

          {/* Número Colegiado */}
          <div className="col-span-2">
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide">N° Colegiado</p>
            <p className="text-gray-700 font-semibold">{medico.numero_colegiado}</p>
          </div>
        </div>

        {/* Email */}
        <div className="mb-4 pb-4 border-t pt-4">
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-1">Correo</p>
          <p className={`${Size.MEDIUM} text-blue-600 break-words`}>{medico.correo}</p>
        </div>

        {/* Fecha de Registro */}
        <div className="mb-6 text-xs text-gray-500">
          <p>Solicitud: {formatDate(medico.fecha_registro)}</p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 w-full">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onApprove(medico.id_medico)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#0094FF] to-[#00E0FF] text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition"
          >
            <MdCheckCircle className="text-lg" />
            <span>Aceptar</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReject(medico.id_medico)}
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
