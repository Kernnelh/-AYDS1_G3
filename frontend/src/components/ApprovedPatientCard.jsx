import { motion } from 'framer-motion';
import { MdDelete, MdInfo } from 'react-icons/md';
import { Size } from "../styles/Styles";

const DEFAULT_AVATAR = 'https://via.placeholder.com/200x200?text=Paciente';

export const ApprovedPatientCard = ({ paciente, onDeactivate }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const ageDiff = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleDeactivate = () => {
    const razon = prompt('¿Cuál es el motivo de la baja?');
    if (razon) {
      onDeactivate(paciente.id_paciente, razon);
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
          src={paciente.fotografia || DEFAULT_AVATAR}
          alt={`${paciente.nombre} ${paciente.apellido}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = DEFAULT_AVATAR;
          }}
        />
      </div>

      {/* Información */}
      <div className="p-5">
        <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-3`}>
          {paciente.nombre} {paciente.apellido}
        </h3>

        {/* Grid de info */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <p className="text-gray-500 font-semibold uppercase">DPI</p>
            <p className="text-gray-700">{paciente.dpi}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold uppercase">Género</p>
            <p className="text-gray-700">{paciente.genero}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold uppercase">Edad</p>
            <p className="text-gray-700">{calculateAge(paciente.fecha_nacimiento)}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold uppercase">Teléfono</p>
            <p className="text-gray-700">{paciente.telefono}</p>
          </div>
        </div>

        {/* Email */}
        <div className="mb-3 pb-3 border-t pt-3">
          <p className="text-gray-500 font-semibold text-xs uppercase mb-1">Correo</p>
          <p className={`${Size.MEDIUM} text-blue-600 break-words text-sm`}>{paciente.correo}</p>
        </div>

        {/* Fecha registro */}
        <div className="mb-4 text-xs text-gray-500">
          <p>Aprobado: {formatDate(paciente.fecha_registro)}</p>
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
