import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdCalendarToday, MdAccessTime } from 'react-icons/md';
import { Size, SizeBox, CButton, Background } from "../styles/Styles";
// DATOS QUEMADOS - Días de atención y horarios del médico
const diasAtencionMock = {
  1: ['Lunes', 'Miércoles', 'Viernes'],
  2: ['Martes', 'Jueves'],
  3: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
};

export const DoctorSchedule = ({ doctor, citas }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableHours, setAvailableHours] = useState([]);

  const diasAtencion = diasAtencionMock[doctor.id_medico] || [];
  const horarioInicio = doctor.horario_inicio || '08:00';
  const horarioFin = doctor.horario_fin || '17:00';

  // Generar horas disponibles
  const generateHours = () => {
    const hours = [];
    const [startHour] = horarioInicio.split(':');
    const [endHour] = horarioFin.split(':');

    for (let i = parseInt(startHour); i < parseInt(endHour); i++) {
      hours.push(`${String(i).padStart(2, '0')}:00`);
      hours.push(`${String(i).padStart(2, '0')}:30`);
    }
    return hours;
  };

  const handleDateSelect = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (date) {
      const selectedDateObj = new Date(date);
      const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(selectedDateObj);
      const dayNameCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);

      // Validar que el médico atienda ese día
      if (!diasAtencion.some(d => d.toLowerCase() === dayNameCapitalized.toLowerCase())) {
        setAvailableHours([]);
        return;
      }

      // Generar horas disponibles
      const hours = generateHours();
      
      // Filtrar horas ocupadas
      const occupiedHours = citas
        .filter(c => c.id_medico === doctor.id_medico && c.fecha === date && c.estado !== 'Cancelada_Paciente' && c.estado !== 'Cancelada_Medico')
        .map(c => c.hora);

      const available = hours.filter(h => !occupiedHours.includes(h));
      setAvailableHours(available);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className={`${Size.LARGE} font-bold text-gray-800 mb-6`}>
        Horarios y Disponibilidad - Dr(a). {doctor.nombre} {doctor.apellido}
      </h2>

      {/* Información general de horario */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
        <div>
          <p className={`${Size.MEDIUM} text-gray-600`}>Días de atención:</p>
          <p className={`${Size.LARGE} font-semibold text-gray-800`}>
            {diasAtencion.join(', ')}
          </p>
        </div>
        <div>
          <p className={`${Size.MEDIUM} text-gray-600`}>Horario:</p>
          <p className={`${Size.LARGE} font-semibold text-gray-800`}>
            {horarioInicio} - {horarioFin}
          </p>
        </div>
      </div>

      {/* Selector de fecha */}
      <div className="mb-6">
        <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>
          <MdCalendarToday className="inline mr-2" />
          Selecciona una fecha:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateSelect}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Horarios disponibles */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-gray-50 rounded-lg"
        >
          <p className={`${Size.MEDIUM} text-gray-700 mb-3`}>
            <MdAccessTime className="inline mr-2" />
            Horarios disponibles para {selectedDate}:
          </p>

          {availableHours.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {availableHours.map((hour, idx) => (
                <div
                  key={idx}
                  className="bg-green-100 border-2 border-green-500 p-2 rounded text-center cursor-pointer hover:bg-green-200"
                >
                  <p className={`${Size.MEDIUM} font-semibold text-green-700`}>{hour}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className={`${Size.MEDIUM} text-red-700`}>
                ❌ No hay horarios disponibles para esta fecha. El médico no atiende este día o todos los horarios están ocupados.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};