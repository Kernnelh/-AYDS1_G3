import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdCalendarToday, MdAccessTime } from 'react-icons/md';
import { Size } from "../styles/Styles";

export const DoctorSchedule = ({ doctor, citas }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableHours, setAvailableHours] = useState([]);
  const [diaNoAtiende, setDiaNoAtiende] = useState(false);

  // Datos del horario desde el backend
  const horario = doctor.horario || null;
  const diasAtencion = horario?.dias || [];
  const horarioInicio = horario?.hora_inicio?.slice(0, 5) || '08:00'; // "08:00:00" → "08:00"
  const horarioFin    = horario?.hora_fin?.slice(0, 5)    || '17:00';

  // Genera slots de 30 minutos entre hora_inicio y hora_fin
  const generateHours = () => {
    const hours = [];
    const [startHour, startMin] = horarioInicio.split(':').map(Number);
    const [endHour,   endMin  ] = horarioFin.split(':').map(Number);

    let h = startHour, m = startMin;
    while (h < endHour || (h === endHour && m < endMin)) {
      hours.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      m += 30;
      if (m >= 60) { m = 0; h++; }
    }
    return hours;
  };

  const handleDateSelect = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setDiaNoAtiende(false);
    setAvailableHours([]);

    if (!date) return;

    // Obtener nombre del día en español
    // Sumamos el offset para evitar el problema UTC
    const [y, mo, d] = date.split('-').map(Number);
    const dateObj = new Date(y, mo - 1, d);
    const nombreDia = new Intl.DateTimeFormat('es-ES', { weekday: 'long' })
      .format(dateObj);
    const diaCapitalizado = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);

    // Validar que el médico atienda ese día
    if (!diasAtencion.some(d => d.toLowerCase() === diaCapitalizado.toLowerCase())) {
      setDiaNoAtiende(true);
      return;
    }

    // Filtrar horas ocupadas por citas existentes
    const horasOcupadas = citas
      .filter(c =>
        c.id_medico === doctor.id_medico &&
        c.fecha === date &&
        c.estado !== 'Cancelada_Paciente' &&
        c.estado !== 'Cancelada_Medico'
      )
      .map(c => c.hora?.slice(0, 5)); // "10:30:00" → "10:30"

    const horasDisponibles = generateHours().filter(h => !horasOcupadas.includes(h));
    setAvailableHours(horasDisponibles);
  };

  if (!horario) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Este médico aún no tiene horario configurado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className={`${Size.LARGE} font-bold text-gray-800 mb-6`}>
        Horarios y Disponibilidad - Dr(a). {doctor.nombre} {doctor.apellido}
      </h2>

      {/* Info del horario */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
        <div>
          <p className={`${Size.MEDIUM} text-gray-600`}>Días de atención:</p>
          <p className={`${Size.LARGE} font-semibold text-gray-800`}>
            {diasAtencion.length > 0 ? diasAtencion.join(', ') : 'No configurado'}
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

      {/* Resultado */}
      {selectedDate && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-gray-50 rounded-lg">
          <p className={`${Size.MEDIUM} text-gray-700 mb-3`}>
            <MdAccessTime className="inline mr-2" />
            Horarios disponibles para {selectedDate}:
          </p>

          {diaNoAtiende ? (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className={`${Size.MEDIUM} text-yellow-700`}>
                ⚠️ El médico no atiende ese día. Días disponibles: {diasAtencion.join(', ')}
              </p>
            </div>
          ) : availableHours.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {availableHours.map((hour, idx) => (
                <div key={idx} className="bg-green-100 border-2 border-green-500 p-2 rounded text-center">
                  <p className={`${Size.MEDIUM} font-semibold text-green-700`}>{hour}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className={`${Size.MEDIUM} text-red-700`}>
                ❌ No hay horarios disponibles para esta fecha.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};