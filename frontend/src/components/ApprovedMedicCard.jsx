import { motion } from 'framer-motion';
import { MdDelete } from 'react-icons/md';
import { Size } from "../styles/Styles";

const DEFAULT_AVATAR = 'https://via.placeholder.com/200x200?text=Doctor';

export const ApprovedMedicCard = ({ medico, onDeactivate }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDeactivate = () => {
    const razon = prompt('¿Cuál es el motivo de la baja?');
    if (razon) {
      onDeactivate(medico.id_medico, razon);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
    >
      {/* Foto */}
      <div className="h-40 bg-gray-200 overflow-hidden flex items-center justify-center border-b-2 border-green-400">
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
      <div className="p-5">
        <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-2`}>
          Dr(a). {medico.nombre} {medico.apellido}
        </h3>

        {/* Especialidad */}
        <p className="text-blue-600 font-semibold mb-3 text-sm">{medico.especialidad}</p>

        {/* Grid de info */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <p className="text-gray-500 font-semibold uppercase">DPI</p>
            <p className="text-gray-700 text-xs">{medico.dpi}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold uppercase">Género</p>
            <p className="text-gray-700">{medico.genero}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500 font-semibold uppercase">N° Colegiado</p>
            <p className="text-gray-700">{medico.numero_colegiado}</p>
          </div>
        </div>

        {/* Email */}
        <div className="mb-3 pb-3 border-t pt-3">
          <p className="text-gray-500 font-semibold text-xs uppercase mb-1">Correo</p>
          <p className={`${Size.MEDIUM} text-blue-600 break-words text-sm`}>{medico.correo}</p>
        </div>

        {/* Fecha aprovado */}
        <div className="mb-4 text-xs text-gray-500">
          <p>Aprobado: {formatDate(medico.fecha_registro)}</p>
        </div>

        {/* Botón dar de baja */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDeactivate}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-2 px-3 rounded-lg hover:bg-red-100 transition border border-red-200"
        >
          <MdDelete className="text-lg" />
          <span>Dar de Baja</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
