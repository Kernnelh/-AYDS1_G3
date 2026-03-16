import { motion } from 'framer-motion';
import { MdHistory, MdCheckCircle, MdCancel } from 'react-icons/md';
import { Size, SizeBox, CButton, Background } from "../styles/Styles";

export const AppointmentHistory = ({ appointments, medicos }) => {
  const historyAppointments = appointments.filter(
    a => a.estado === 'Atendida' || a.estado === 'Cancelada_Paciente' || a.estado === 'Cancelada_Medico'
  );

  const getDoctorInfo = (idMedico) => {
    return medicos.find(m => m.id_medico === idMedico);
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Atendida':
        return 'bg-green-50 border-l-green-500 text-green-700';
      case 'Cancelada_Paciente':
      case 'Cancelada_Medico':
        return 'bg-red-50 border-l-red-500 text-red-700';
      default:
        return 'bg-gray-50 border-l-gray-500 text-gray-700';
    }
  };

  const getStatusIcon = (estado) => {
    if (estado === 'Atendida') return <MdCheckCircle className="text-green-600" />;
    if (estado === 'Cancelada_Paciente' || estado === 'Cancelada_Medico') return <MdCancel className="text-red-600" />;
    return null;
  };

  const getStatusLabel = (estado) => {
    if (estado === 'Atendida') return 'Atendida';
    if (estado === 'Cancelada_Paciente') return 'Cancelada (Por ti)';
    if (estado === 'Cancelada_Medico') return 'Cancelada (Por el médico)';
    return estado;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className={`${Size.LARGE} font-bold text-gray-800 mb-6`}>
        <MdHistory className="inline mr-2" />
        Historial de Citas
      </h2>

      {historyAppointments.length === 0 ? (
        <div className="text-center py-12">
          <p className={`${Size.LARGE} text-gray-600`}>
            No tienes historial de citas aún
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {historyAppointments.map((appointment, idx) => {
            const doctor = getDoctorInfo(appointment.id_medico);

            return (
              <motion.div
                key={appointment.id_cita}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`border-l-4 p-4 rounded-lg ${getStatusColor(appointment.estado)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(appointment.estado)}
                      <h3 className={`${Size.LARGE} font-bold`}>
                        Dr(a). {doctor?.nombre} {doctor?.apellido}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className={`${Size.MEDIUM} opacity-75`}>Fecha:</p>
                        <p className={`${Size.LARGE} font-semibold`}>
                          {new Date(appointment.fecha).toLocaleDateString('es-ES')}
                        </p>
                      </div>

                      <div>
                        <p className={`${Size.MEDIUM} opacity-75`}>Hora:</p>
                        <p className={`${Size.LARGE} font-semibold`}>
                          {appointment.hora}
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <p className={`${Size.MEDIUM} opacity-75`}>Clínica:</p>
                        <p className={`${Size.MEDIUM}`}>
                          {doctor?.direccion_clinica}
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <p className={`${Size.MEDIUM} opacity-75`}>Motivo:</p>
                        <p className={`${Size.MEDIUM}`}>
                          {appointment.motivo}
                        </p>
                      </div>

                      {appointment.estado === 'Atendida' && appointment.tratamiento && (
                        <div className="md:col-span-2 bg-white bg-opacity-50 p-3 rounded">
                          <p className={`${Size.MEDIUM} opacity-75`}>Tratamiento:</p>
                          <p className={`${Size.MEDIUM}`}>
                            {appointment.tratamiento}
                          </p>
                        </div>
                      )}

                      <div className="md:col-span-2">
                        <p className={`${Size.MEDIUM} font-semibold`}>
                          Estado: {getStatusLabel(appointment.estado)}
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