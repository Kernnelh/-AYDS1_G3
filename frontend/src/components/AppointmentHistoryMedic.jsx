import { motion } from 'framer-motion';
import { Size } from "../styles/Styles";

export const AppointmentHistoryMedic = ({ appointments, pacientes }) => {
  const getPacienteInfo = (idPaciente) => {
    return pacientes.find(p => p.id_paciente === idPaciente);
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Atendida':
        return 'bg-green-50 border-l-green-500 text-green-700';
      case 'Cancelada_Paciente':
        return 'bg-orange-50 border-l-orange-500 text-orange-700';
      case 'Cancelada_Medico':
        return 'bg-red-50 border-l-red-500 text-red-700';
      default:
        return 'bg-gray-50 border-l-gray-500 text-gray-700';
    }
  };

  const getStatusIcon = (estado) => {
    if (estado === 'Atendida') return '✓';
    if (estado === 'Cancelada_Paciente') return '✕ (Paciente)';
    if (estado === 'Cancelada_Medico') return '✕ (Médico)';
    return estado;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className={`${Size.LARGE} font-bold text-gray-800 mb-6`}>
        Historial de Citas
      </h2>

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <p className={`${Size.LARGE} text-gray-600`}>
            No tienes historial de citas aún
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment, idx) => {
            const paciente = getPacienteInfo(appointment.id_paciente);

            return (
              <motion.div
                key={appointment.id_cita}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`border-l-4 p-4 rounded-lg ${getStatusColor(appointment.estado)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={`${Size.LARGE} font-bold`}>
                      {paciente?.nombre} {paciente?.apellido}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className={`${Size.MEDIUM} opacity-75`}>Fecha:</p>
                        <p className={`${Size.LARGE} font-semibold`}>
                          {new Date(appointment.fecha).toLocaleDateString('es-ES')}
                        </p>
                      </div>

                      <div>
                        <p className={`${Size.MEDIUM} opacity-75`}>Hora:</p>
                        <p className={`${Size.LARGE} font-semibold`}>{appointment.hora}</p>
                      </div>

                      <div className="md:col-span-2">
                        <p className={`${Size.MEDIUM} opacity-75`}>Motivo:</p>
                        <p className={`${Size.MEDIUM}`}>{appointment.motivo}</p>
                      </div>

                      {appointment.estado === 'Atendida' && appointment.tratamiento && (
                        <div className="md:col-span-2 bg-white bg-opacity-50 p-3 rounded">
                          <p className={`${Size.MEDIUM} opacity-75`}>Tratamiento Indicado:</p>
                          <p className={`${Size.MEDIUM}`}>{appointment.tratamiento}</p>
                        </div>
                      )}

                      <div className="md:col-span-2">
                        <p className={`${Size.MEDIUM} font-semibold`}>
                          Estado: {getStatusIcon(appointment.estado)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};