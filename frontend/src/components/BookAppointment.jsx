import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdEventNote } from 'react-icons/md';
import { Size, SizeBox, CButton, Background } from "../styles/Styles";
export const BookAppointment = ({ doctor, onBook, existingAppointments }) => {
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    motivo: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
    if (!formData.hora) newErrors.hora = 'La hora es requerida';
    if (!formData.motivo || formData.motivo.trim() === '') {
      newErrors.motivo = 'El motivo es requerido';
    }

    // Validar que sea una fecha futura
    const selectedDate = new Date(formData.fecha);
    if (selectedDate < new Date()) {
      newErrors.fecha = 'No puedes agendar citas en fechas pasadas';
    }

    // Validar que el paciente no tenga más de una cita con el mismo médico
    const hasDuplicate = existingAppointments.some(
      c => c.id_medico === doctor.id_medico && 
           c.estado !== 'Cancelada_Paciente' && 
           c.estado !== 'Cancelada_Medico'
    );

    if (hasDuplicate) {
      newErrors.general = 'Ya tienes una cita activa con este médico';
    }

    // Validar que no tenga dos citas el mismo día a la misma hora
    const hasTimeConflict = existingAppointments.some(
      c => c.fecha === formData.fecha && 
           c.hora === formData.hora &&
           c.estado !== 'Cancelada_Paciente' && 
           c.estado !== 'Cancelada_Medico'
    );

    if (hasTimeConflict) {
      newErrors.hora = 'Ya tienes una cita a esta hora';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // CREAR NUEVA CITA - DATOS QUEMADOS CON ID DE PACIENTE 1
    const newAppointment = {
      id_cita: Math.max(...existingAppointments.map(c => c.id_cita), 0) + 1,
      id_paciente: 1, // REEMPLAZAR CON ID DEL PACIENTE ACTUAL DEL SESSION/AUTH
      id_medico: doctor.id_medico,
      fecha: formData.fecha,
      hora: formData.hora,
      motivo: formData.motivo,
      tratamiento: null,
      estado: 'Pendiente',
      fecha_creacion: new Date().toISOString(),
      fecha_cancelacion: null,
    };

    onBook(newAppointment);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFormData({ fecha: '', hora: '', motivo: '' });
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className={`${Size.LARGE} font-bold text-gray-800 mb-6`}>
        <MdEventNote className="inline mr-2" />
        Agendar Cita con Dr(a). {doctor.nombre} {doctor.apellido}
      </h2>

      {errors.general && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className={`${Size.MEDIUM} text-red-700`}>⚠️ {errors.general}</p>
        </div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded"
        >
          <p className={`${Size.MEDIUM} text-green-700`}>✅ ¡Cita agendada exitosamente!</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fecha */}
        <div>
          <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Fecha de la cita:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.fecha ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.fecha && <p className="text-red-600 text-sm mt-1">{errors.fecha}</p>}
        </div>

        {/* Hora */}
        <div>
          <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Hora de la cita:</label>
          <input
            type="time"
            name="hora"
            value={formData.hora}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.hora ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.hora && <p className="text-red-600 text-sm mt-1">{errors.hora}</p>}
        </div>

        {/* Motivo */}
        <div>
          <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Motivo de la consulta:</label>
          <textarea
            name="motivo"
            value={formData.motivo}
            onChange={handleInputChange}
            placeholder="Describe brevemente tus síntomas u otro motivo de la consulta"
            rows="4"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
              errors.motivo ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.motivo && <p className="text-red-600 text-sm mt-1">{errors.motivo}</p>}
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold transition"
        >
          Confirmar Cita
        </button>
      </form>
    </div>
  );
};