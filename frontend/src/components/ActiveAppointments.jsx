import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Size } from "../styles/Styles";

export const ActiveAppointments = ({ appointments, onCancel, medicos }) => {
  const [cancelingId, setCancelingId] = useState(null);

  const activeAppointments = appointments.filter(
    a => a.estado === 'Pendiente' || a.estado === 'Atendida'
  );

  const pendingAppointments = activeAppointments.filter(a => a.estado === 'Pendiente');

  const handleCancelClick = (appointmentId) => {
    setCancelingId(appointmentId);
  };

  const handleConfirmCancel = (appointmentId) => {
    onCancel(appointmentId);
    setCancelingId(null);
  };

  const getDoctorInfo = (idMedico) => {
    return medicos.find(m => m.id_medico === idMedico);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className={`${Size.LARGE} font-bold text-gray-800 mb-6`}>
          Mis Citas Activas
        </h2>

        {pendingAppointments.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${Size.LARGE} text-gray-600`}>
              No tienes citas pendientes agendadas
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {pendingAppointments.map((appointment) => {
                const doctor = getDoctorInfo(appointment.id_medico);
                const isConfirmingCancel = cancelingId === appointment.id_cita;

                return (
                  <motion.div
                    key={appointment.id_cita}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className={`${Size.LARGE} font-bold text-gray-800`}>
                          Dr(a). {doctor?.nombre} {doctor?.apellido}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className={`${Size.MEDIUM} text-gray-600`}>Fecha:</p>
                            <p className={`${Size.LARGE} font-semibold text-gray-800`}>
                              {new Date(appointment.fecha).toLocaleDateString('es-ES')}
                            </p>
                          </div>

                          <div>
                            <p className={`${Size.MEDIUM} text-gray-600`}>Hora:</p>
                            <p className={`${Size.LARGE} font-semibold text-gray-800`}>
                              {appointment.hora}
                            </p>
                          </div>

                          <div className="md:col-span-2">
                            <p className={`${Size.MEDIUM} text-gray-600`}>Clínica:</p>
                            <p className={`${Size.MEDIUM} text-gray-800`}>
                              {doctor?.direccion_clinica}
                            </p>
                          </div>

                          <div className="md:col-span-2">
                            <p className={`${Size.MEDIUM} text-gray-600`}>Motivo:</p>
                            <p className={`${Size.MEDIUM} text-gray-800`}>
                              {appointment.motivo}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Botón cancelar */}
                      <div className="ml-4">
                        {isConfirmingCancel ? (
                          <div className="bg-white p-4 rounded shadow-md space-y-2 min-w-64">
                            <p className={`${Size.MEDIUM} text-gray-800 font-semibold`}>
                              ¿Estás seguro de cancelar esta cita?
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleConfirmCancel(appointment.id_cita)}
                                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 font-semibold"
                              >
                                Sí, cancelar
                              </button>
                              <button
                                onClick={() => setCancelingId(null)}
                                className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 font-semibold"
                              >
                                No, volver
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCancelClick(appointment.id_cita)}
                            className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
                            title="Cancelar cita"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};