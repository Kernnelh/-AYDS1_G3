import { useState } from 'react';
import { motion } from 'framer-motion';
import { Size } from "../styles/Styles";

export const TreatmentForm = ({ appointment, paciente, onSave, onClose }) => {
  const [treatment, setTreatment] = useState('');
  const [errors, setErrors] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!treatment.trim()) {
      setErrors('El tratamiento es requerido');
      return;
    }

    onSave(treatment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
      >
        <h2 className={`${Size.LARGE} font-bold text-gray-800 mb-4`}>
          Atender Paciente: {paciente?.nombre} {paciente?.apellido}
        </h2>

        {/* Información de la cita */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`${Size.MEDIUM} text-gray-600`}>Fecha:</p>
              <p className={`${Size.LARGE} font-semibold`}>
                {new Date(appointment.fecha).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <p className={`${Size.MEDIUM} text-gray-600`}>Hora:</p>
              <p className={`${Size.LARGE} font-semibold`}>{appointment.hora}</p>
            </div>
            <div className="col-span-2">
              <p className={`${Size.MEDIUM} text-gray-600`}>Motivo:</p>
              <p className={`${Size.MEDIUM}`}>{appointment.motivo}</p>
            </div>
          </div>
        </div>

        {/* Formulario de tratamiento */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>
              Tratamiento Recomendado:
            </label>
            <textarea
              value={treatment}
              onChange={(e) => {
                setTreatment(e.target.value);
                setErrors('');
              }}
              placeholder="Describe el tratamiento que el paciente debe seguir..."
              rows="6"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                errors ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors && <p className="text-red-600 text-sm mt-1">{errors}</p>}
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-semibold"
            >
              ✓ Marcar como Atendido
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};