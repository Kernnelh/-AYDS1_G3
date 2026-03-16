import { useState } from 'react';
import { motion } from 'framer-motion';
import { Size, SizeBox, CButton, Background } from "../styles/Styles";
import { Button1 } from "../components/Button1";
import { PendingAppointmentsMedic } from "../components/PendingAppointmentsMedic";
import { TreatmentForm } from "../components/TreatmentForm";
import { SetSchedule } from "../components/SetSchedule";
import { AppointmentHistoryMedic } from "../components/AppointmentHistoryMedic";
import { MedicProfile } from "../components/MedicProfile";

// DATOS QUEMADOS - REEMPLAZAR CON DATOS DEL BACKEND
import { medicosMock, citasMock, pacientesMock } from "../mock/dataMock";

export const DashboardMedic = () => {
  // Estados para navegación
  const [activeSection, setActiveSection] = useState('citas_pendientes');

  // Estados para médico y citas
  const [medico, setMedico] = useState(medicosMock[0]); // REEMPLAZAR CON DATOS DEL MÉDICO AUTENTICADO
  const [citas, setCitas] = useState(citasMock);
  const [pacientes, setPacientes] = useState(pacientesMock);

  // Estados para atender paciente
  const [treatmentModal, setTreatmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Estados para cancelar cita
  const [cancelingId, setCancelingId] = useState(null);

  // Filtrar citas pendientes del médico actual
  const pendingAppointments = citas
    .filter(c => c.id_medico === medico.id_medico && c.estado === 'Pendiente')
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  // Manejador para abrir modal de tratamiento
  const handleAttendClick = (appointment) => {
    setSelectedAppointment(appointment);
    setTreatmentModal(true);
  };

  // Manejador para guardar tratamiento
  const handleSaveTreatment = (treatment) => {
    if (!selectedAppointment) return;

    const updatedCitas = citas.map(cita =>
      cita.id_cita === selectedAppointment.id_cita
        ? { ...cita, estado: 'Atendida', tratamiento: treatment }
        : cita
    );
    setCitas(updatedCitas);
    setTreatmentModal(false);
    setSelectedAppointment(null);
  };

  // Manejador para cancelar cita
  const handleCancelAppointment = (appointmentId) => {
    const appointment = citas.find(c => c.id_cita === appointmentId);
    if (!appointment) return;

    // Aquí iría la lógica de envío de correo al paciente
    console.log('📧 Enviar correo de cancelación a:', pacientes.find(p => p.id_paciente === appointment.id_paciente)?.correo);

    const updatedCitas = citas.map(cita =>
      cita.id_cita === appointmentId
        ? { ...cita, estado: 'Cancelada_Medico', fecha_cancelacion: new Date().toISOString() }
        : cita
    );
    setCitas(updatedCitas);
    setCancelingId(null);
  };

  // Manejador para actualizar horario
  const handleUpdateSchedule = (newSchedule) => {
    // Validar que no haya citas fuera del nuevo rango horario
    const conflictingAppointments = citas.filter(c => {
      if (c.id_medico !== medico.id_medico || c.estado === 'Cancelada_Paciente' || c.estado === 'Cancelada_Medico') {
        return false;
      }
      const citaHour = parseInt(c.hora.split(':')[0]);
      const newStart = parseInt(newSchedule.hora_inicio.split(':')[0]);
      const newEnd = parseInt(newSchedule.hora_fin.split(':')[0]);
      return citaHour < newStart || citaHour >= newEnd;
    });

    if (conflictingAppointments.length > 0) {
      alert('⚠️ No puedes actualizar tu horario mientras haya citas activas fuera del nuevo rango. Reprograma o cancela esas citas primero.');
      return;
    }

    setMedico({
      ...medico,
      horario_inicio: newSchedule.hora_inicio,
      horario_fin: newSchedule.hora_fin,
      dias_atencion: newSchedule.dias_atencion
    });
  };

  // Manejador para actualizar perfil
  const handleUpdateProfile = (updatedProfile) => {
    setMedico(updatedProfile);
  };

  return (
    <div className={`min-h-screen ${Background.BACKGROUND} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8 bg-white rounded-lg p-6 shadow-md"
        >
          <div>
            <h1 className={`${Size.EXTRALARGE} text-gray-800`}>Bienvenido, Dr(a). {medico.nombre}</h1>
            <p className={`${Size.MEDIUM} text-gray-600`}>Gestiona tus citas y horarios</p>
          </div>
          <div className="flex gap-4">
            <Button1 
              nombre="Cerrar sesión" 
              id="logout"
              type='link' 
              link='/'
              color={CButton.MATE}
            />
          </div>
        </motion.div>

        {/* Navegación de Secciones */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 mb-8 bg-white rounded-lg p-4 shadow-md"
        >
          <button
            onClick={() => setActiveSection('citas_pendientes')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeSection === 'citas_pendientes'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Citas Pendientes ({pendingAppointments.length})
          </button>
          <button
            onClick={() => setActiveSection('horarios')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeSection === 'horarios'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mis Horarios
          </button>
          <button
            onClick={() => setActiveSection('historial')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeSection === 'historial'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Historial de Citas
          </button>
          <button
            onClick={() => setActiveSection('perfil')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeSection === 'perfil'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mi Perfil
          </button>
        </motion.div>

        {/* SECCIÓN: CITAS PENDIENTES */}
        {activeSection === 'citas_pendientes' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <PendingAppointmentsMedic
              appointments={pendingAppointments}
              pacientes={pacientes}
              onAttend={handleAttendClick}
              onCancel={() => setCancelingId('confirm')}
              onConfirmCancel={handleCancelAppointment}
              cancelingId={cancelingId}
              setCancelingId={setCancelingId}
            />
          </motion.div>
        )}

        {/* SECCIÓN: HORARIOS */}
        {activeSection === 'horarios' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <SetSchedule
              medico={medico}
              onUpdate={handleUpdateSchedule}
            />
          </motion.div>
        )}

        {/* SECCIÓN: HISTORIAL */}
        {activeSection === 'historial' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AppointmentHistoryMedic
              appointments={citas.filter(c => c.id_medico === medico.id_medico && c.estado !== 'Pendiente')}
              pacientes={pacientes}
            />
          </motion.div>
        )}

        {/* SECCIÓN: PERFIL */}
        {activeSection === 'perfil' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MedicProfile
              medico={medico}
              onUpdate={handleUpdateProfile}
            />
          </motion.div>
        )}

        {/* Modal de tratamiento */}
        {treatmentModal && selectedAppointment && (
          <TreatmentForm
            appointment={selectedAppointment}
            paciente={pacientes.find(p => p.id_paciente === selectedAppointment.id_paciente)}
            onSave={handleSaveTreatment}
            onClose={() => {
              setTreatmentModal(false);
              setSelectedAppointment(null);
            }}
          />
        )}
      </div>
    </div>
  );
};