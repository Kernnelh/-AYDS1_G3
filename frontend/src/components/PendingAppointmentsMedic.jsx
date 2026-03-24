import { motion, AnimatePresence } from 'framer-motion';
import { Size } from "../styles/Styles";

export const PendingAppointmentsMedic = ({
  appointments,
  pacientes,
  onAttend,
  onCancel,
  onConfirmCancel,
  cancelingId,
  setCancelingId
}) => {
  const getPacienteInfo = (idPaciente) => {
    return pacientes.find(p => p.id_paciente === idPaciente);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className={`${Size.LARGE} font-bold text-gray-800 mb-6`}>
        Citas Pendientes por Atender
      </h2>

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <p className={`${Size.LARGE} text-gray-600`}>
            ✓ No tienes citas pendientes. ¡Descansa!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {appointments.map((appointment, idx) => {
              const paciente = getPacienteInfo(appointment.id_paciente);
              const isConfirmingCancel = cancelingId === appointment.id_cita;

              return (
                <motion.div
                  key={appointment.id_cita}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border-l-4 border-green-500 bg-green-50 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className={`${Size.LARGE} font-bold text-gray-800`}>
                        {paciente?.nombre} {paciente?.apellido}
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
                          <p className={`${Size.MEDIUM} text-gray-600`}>Motivo:</p>
                          <p className={`${Size.MEDIUM} text-gray-800`}>
                            {appointment.motivo}
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <p className={`${Size.MEDIUM} text-gray-600`}>Contacto:</p>
                          <p className={`${Size.MEDIUM} text-gray-800`}>
                            📧 {paciente?.correo} | 📱 {paciente?.telefono}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        onClick={() => onAttend(appointment)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold whitespace-nowrap"
                      >
                        ✓ Atender
                      </button>

                      {isConfirmingCancel ? (
                        <div className="bg-white p-3 rounded shadow-md space-y-2 min-w-56">
                          <p className={`${Size.MEDIUM} text-gray-800 font-semibold`}>
                            ¿Cancelar cita?
                          </p>
                          <p className={`${Size.SMALL} text-gray-600`}>
                            Se enviará correo al paciente
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onConfirmCancel(appointment.id_cita)}
                              className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 font-semibold text-sm"
                            >
                              Sí
                            </button>
                            <button
                              onClick={() => setCancelingId(null)}
                              className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 font-semibold text-sm"
                            >
                              No
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCancelingId(appointment.id_cita)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold whitespace-nowrap"
                        >
                          ✕ Cancelar
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
  );
};