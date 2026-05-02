import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdHistory, MdCheckCircle, MdCancel, MdStar, MdWarning } from 'react-icons/md';
import { Size } from "../styles/styles";
import { RateDoctor } from './RateDoctor';
import { ReportDoctor } from './ReportDoctor';

export const AppointmentHistory = ({ appointments, onActionSuccess }) => {
  const [modalCalificar, setModalCalificar] = useState(null); // appointment seleccionada
  const [modalReportar, setModalReportar] = useState(null);   // appointment seleccionada

  const historyAppointments = appointments.filter(
    a => a.estado === 'Atendida' || a.estado === 'Cancelada_Paciente' || a.estado === 'Cancelada_Medico'
  );

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
    if (estado === 'Cancelada_Paciente' || estado === 'Cancelada_Medico')
      return <MdCancel className="text-red-600" />;
    return null;
  };

  const getStatusLabel = (estado) => {
    if (estado === 'Atendida') return 'Atendida';
    if (estado === 'Cancelada_Paciente') return 'Cancelada (Por ti)';
    if (estado === 'Cancelada_Medico') return 'Cancelada (Por el médico)';
    return estado;
  };

  return (
    <>
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
            {historyAppointments.map((appointment, idx) => (
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
                        {appointment.medico}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className={`${Size.MEDIUM} opacity-75`}>Fecha:</p>
                        <p className={`${Size.LARGE} font-semibold`}>
                          {new Date(appointment.fecha + 'T00:00:00').toLocaleDateString('es-ES')}
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
                        <p className={`${Size.MEDIUM}`}>{appointment.direccion_clinica}</p>
                      </div>

                      <div className="md:col-span-2">
                        <p className={`${Size.MEDIUM} opacity-75`}>Motivo:</p>
                        <p className={`${Size.MEDIUM}`}>{appointment.motivo}</p>
                      </div>

                      {appointment.estado === 'Atendida' && appointment.tratamiento && (
                        <div className="md:col-span-2 bg-white bg-opacity-50 p-3 rounded">
                          <p className={`${Size.MEDIUM} opacity-75`}>Tratamiento:</p>
                          <p className={`${Size.MEDIUM}`}>{appointment.tratamiento}</p>
                        </div>
                      )}

                      <div className="md:col-span-2">
                        <p className={`${Size.MEDIUM} font-semibold`}>
                          Estado: {getStatusLabel(appointment.estado)}
                        </p>
                      </div>
                    </div>

                    {/* ── Acciones solo para citas Atendidas ── */}
                    {appointment.estado === 'Atendida' && (
                      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-current border-opacity-20">
                        {/* Calificar */}
                        {!appointment.calificado && (
                          <button
                            onClick={() => setModalCalificar(appointment)}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition text-sm"
                          >
                            <MdStar /> Calificar atención
                          </button>
                        )}
                        {appointment.calificado && (
                          <span className="flex items-center gap-1 px-4 py-2 bg-yellow-100 text-yellow-700 font-semibold rounded-lg text-sm">
                            <MdStar /> Ya calificaste esta cita
                          </span>
                        )}

                        {/* Reportar */}
                        {!appointment.reportado && (
                          <button
                            onClick={() => setModalReportar(appointment)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition text-sm"
                          >
                            <MdWarning /> Reportar médico
                          </button>
                        )}
                        {appointment.reportado && (
                          <span className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg text-sm">
                            <MdWarning /> Médico ya reportado
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      {modalCalificar && (
        <RateDoctor
          appointment={modalCalificar}
          onClose={() => setModalCalificar(null)}
          onSuccess={(msg) => {
            setModalCalificar(null);
            onActionSuccess && onActionSuccess(msg);
          }}
        />
      )}

      {modalReportar && (
        <ReportDoctor
          appointment={modalReportar}
          onClose={() => setModalReportar(null)}
          onSuccess={(msg) => {
            setModalReportar(null);
            onActionSuccess && onActionSuccess(msg);
          }}
        />
      )}
    </>
  );
};
