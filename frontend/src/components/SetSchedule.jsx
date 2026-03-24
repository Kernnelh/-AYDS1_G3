import { useState } from 'react';
import { motion } from 'framer-motion';
import { Size } from "../styles/Styles";

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const SetSchedule = ({ medico, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    hora_inicio: medico.horario_inicio || '08:00',
    hora_fin: medico.horario_fin || '17:00',
    dias_atencion: medico.dias_atencion || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
  });
  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDiaChange = (dia) => {
    setFormData(prev => ({
      ...prev,
      dias_atencion: prev.dias_atencion.includes(dia)
        ? prev.dias_atencion.filter(d => d !== dia)
        : [...prev.dias_atencion, dia]
    }));
    setErrors('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors('');
  };

  const validateForm = () => {
    if (formData.dias_atencion.length === 0) {
      setErrors('Debes seleccionar al menos un día de atención');
      return false;
    }

    if (formData.hora_inicio >= formData.hora_fin) {
      setErrors('La hora de inicio debe ser menor que la hora de fin');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onUpdate(formData);
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-green-50 border-l-4 border-green-500 rounded"
        >
          <p className={`${Size.MEDIUM} text-green-700`}>✓ Horario actualizado exitosamente</p>
        </motion.div>
      )}

      {errors && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-50 border-l-4 border-red-500 rounded"
        >
          <p className={`${Size.MEDIUM} text-red-700`}>⚠️ {errors}</p>
        </motion.div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`${Size.LARGE} font-bold text-gray-800`}>Mis Horarios de Atención</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold"
            >
              ✎ Editar Horarios
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className={`${Size.MEDIUM} text-gray-600`}>Horario de Atención:</p>
              <p className={`${Size.LARGE} font-semibold text-gray-800`}>
                {medico.horario_inicio} - {medico.horario_fin}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className={`${Size.MEDIUM} text-gray-600 mb-2`}>Días de Atención:</p>
              <div className="flex flex-wrap gap-2">
                {medico.dias_atencion?.map(dia => (
                  <span key={dia} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {dia}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Horarios */}
            <div>
              <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Hora de Inicio:</label>
              <input
                type="time"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Hora de Fin:</label>
              <input
                type="time"
                name="hora_fin"
                value={formData.hora_fin}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Días de atención */}
            <div>
              <label className={`${Size.MEDIUM} text-gray-700 block mb-3`}>Días de Atención:</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DIAS_SEMANA.map(dia => (
                  <label key={dia} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dias_atencion.includes(dia)}
                      onChange={() => handleDiaChange(dia)}
                      className="w-4 h-4 text-blue-500 rounded focus:ring-2"
                    />
                    <span className={`${Size.MEDIUM} text-gray-700`}>{dia}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-semibold"
              >
                ✓ Guardar Cambios
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setErrors('');
                  setFormData({
                    hora_inicio: medico.horario_inicio || '08:00',
                    hora_fin: medico.horario_fin || '17:00',
                    dias_atencion: medico.dias_atencion || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
                  });
                }}
                className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};