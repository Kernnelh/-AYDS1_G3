import { motion } from 'framer-motion';
import { Size } from "../styles/Styles";

export const DoctorCard = ({ doctor, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
    >
      {/* Imagen del médico */}
      <div className="h-48 bg-gray-300 overflow-hidden">
        <img
          src={doctor.fotografia || 'https://ibb.co/PZVKVFzk'}
          alt={doctor.nombre}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Información del médico */}
      <div className="p-4">
        <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-2`}>
          Dr(a). {doctor.nombre} {doctor.apellido}
        </h3>

        {/* Especialidad */}
        <div className="mb-3">
          <p className={`${Size.MEDIUM} text-blue-600 font-semibold`}>{doctor.especialidad}</p>
        </div>

        {/* Dirección */}
        <div className="mb-3">
          <p className={`${Size.MEDIUM} text-gray-600`}>{doctor.direccion_clinica}</p>
        </div>

        {/* Teléfono */}
        <div className="mb-4">
          <p className={`${Size.MEDIUM} text-gray-600`}>{doctor.telefono}</p>
        </div>

        {/* Botón */}
        <button
          onClick={() => onSelect(doctor)}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-semibold transition"
        >
          Ver Horarios y Agendar
        </button>
      </div>
    </motion.div>
  );
};