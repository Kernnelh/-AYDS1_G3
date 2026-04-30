import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdLogout } from 'react-icons/md';
import { Size, Background } from "../styles/styles";
import { PendingAppointmentsMedic } from "../components/PendingAppointmentsMedic";
import { TreatmentForm } from "../components/TreatmentForm";
import { SetSchedule } from "../components/SetSchedule";
import { AppointmentHistoryMedic } from "../components/AppointmentHistoryMedic";
import { MedicProfile } from "../components/MedicProfile";

const API = 'http://127.0.0.1:8000';

export const DashboardMedic = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const [activeSection, setActiveSection] = useState('citas_pendientes');
  const [medico, setMedico] = useState(null);
  const [citas, setCitas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [treatmentModal, setTreatmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // ── Toast global (calificar / reportar) ──
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [resPerfil, resCitas, resHistorial] = await Promise.all([
        fetch(`${API}/api/medicos/perfil`, { headers: authHeaders }),
        fetch(`${API}/api/medicos/citas/pendientes`, { headers: authHeaders }),
        fetch(`${API}/api/medicos/citas/historial`, { headers: authHeaders }),
      ]);

      if (resPerfil.status === 401) { handleLogout(); return; }

      setMedico(await resPerfil.json());
      setCitas(await resCitas.json());
      setHistorial(await resHistorial.json());
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    navigate('/');
  };

  // ── Atender cita — abre modal ──
  const handleAttendClick = (appointment) => {
    setSelectedAppointment(appointment);
    setTreatmentModal(true);
  };

  // ── Guardar tratamiento estructurado ──
  // treatment = { diagnostico, medicamentos: [{nombre, cantidad, tiempo, descripcion_dosis}] }
  const handleSaveTreatment = async (treatment) => {
    try {
      const res = await fetch(`${API}/api/medicos/citas/${selectedAppointment.id_cita}/atender`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(treatment), // ahora manda el objeto estructurado
      });

      if (!res.ok) {
        const datos = await res.json();
        alert(datos.detail || 'Error al guardar tratamiento');
        return;
      }

      await cargarDatos();
      setTreatmentModal(false);
      setSelectedAppointment(null);
    } catch {
      alert('Error de conexión.');
    }
  };

  // ── Cancelar cita ──
  const handleCancelAppointment = async (appointmentId, motivoCancelacion) => {
    try {
      const res = await fetch(`${API}/api/medicos/citas/${appointmentId}/cancelar`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ motivo_cancelacion: motivoCancelacion }),
      });

      if (!res.ok) {
        const datos = await res.json();
        alert(datos.detail || 'Error al cancelar');
        return;
      }

      await cargarDatos();
      setCancelingId(null);
    } catch {
      alert('Error de conexión.');
    }
  };

  // ── Cambio de sección ──
  const handleSectionChange = async (key) => {
    setActiveSection(key);
    // Refresca historial al entrar (para reflejar calificado/reportado)
    if (key === 'historial') {
      try {
        const res = await fetch(`${API}/api/medicos/citas/historial`, { headers: authHeaders });
        if (res.ok) setHistorial(await res.json());
      } catch { /* silencioso */ }
    }
  };

  // ── Actualizar horario ──
  const handleUpdateSchedule = async (newSchedule) => {
    try {
      const res = await fetch(`${API}/api/medicos/horarios`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          hora_inicio: newSchedule.hora_inicio,
          hora_fin: newSchedule.hora_fin,
          dias: newSchedule.dias_atencion,
        }),
      });

      if (!res.ok) {
        const datos = await res.json();
        // Re-lanza con el mensaje del backend (ej: "hay citas activas fuera del rango")
        throw new Error(datos.detail || 'Error al actualizar horario');
      }

      await cargarDatos();
      return true;
    } catch (err) {
      throw err; // SetSchedule lo muestra
    }
  };

  // ── Actualizar perfil ──
  const handleUpdateProfile = async (updatedProfile) => {
    try {
      const res = await fetch(`${API}/api/medicos/perfil`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          nombre: updatedProfile.nombre,
          apellido: updatedProfile.apellido,
          telefono: updatedProfile.telefono,
          direccion: updatedProfile.direccion,
          direccion_clinica: updatedProfile.direccion_clinica,
          especialidad: updatedProfile.especialidad,
          genero: updatedProfile.genero,
          fecha_nacimiento: updatedProfile.fecha_nacimiento,
        }),
      });

      if (!res.ok) {
        const datos = await res.json();
        alert(datos.detail || 'Error al actualizar perfil');
        return;
      }

      setMedico(await res.json());
    } catch {
      alert('Error de conexión.');
    }
  };

  // ── Toast tras calificar / reportar ──
  const handleActionSuccess = async (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
    // Refresca historial para que los botones cambien a "ya hecho"
    try {
      const res = await fetch(`${API}/api/medicos/citas/historial`, { headers: authHeaders });
      if (res.ok) setHistorial(await res.json());
    } catch { /* silencioso */ }
  };

  // ── Loading / Error ──
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Cargando...</p>
      </div>
    );
  }

  if (error || !medico) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">{error || 'Error al cargar datos'}</p>
      </div>
    );
  }

  const NAV_TABS = [
    { key: 'citas_pendientes', label: `Citas Pendientes (${citas.length})` },
    { key: 'horarios',         label: 'Mis Horarios' },
    { key: 'historial',        label: 'Historial de Citas' },
    { key: 'perfil',           label: 'Mi Perfil' },
  ];

  return (
    <div className={`min-h-screen ${Background.BACKGROUND} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">

        {/* Toast global */}
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold"
          >
            ✅ {toastMsg}
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8 bg-white rounded-lg p-6 shadow-md"
        >
          <div>
            <h1 className={`${Size.EXTRALARGE} text-gray-800`}>
              Bienvenido, Dr. {medico.nombre} {medico.apellido}
            </h1>
            <p className={`${Size.MEDIUM} text-gray-600`}>Gestiona tus citas y horarios</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
          >
            <MdLogout /> Cerrar sesión
          </button>
        </motion.div>

        {/* Navegación */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 mb-8 bg-white rounded-lg p-4 shadow-md"
        >
          {NAV_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSectionChange(key)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeSection === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* ── CITAS PENDIENTES ── */}
        {activeSection === 'citas_pendientes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PendingAppointmentsMedic
              appointments={citas}
              onAttend={handleAttendClick}
              onConfirmCancel={handleCancelAppointment}
              cancelingId={cancelingId}
              setCancelingId={setCancelingId}
            />
          </motion.div>
        )}

        {/* ── HORARIOS ── */}
        {activeSection === 'horarios' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SetSchedule medico={medico} onUpdate={handleUpdateSchedule} />
          </motion.div>
        )}

        {/* ── HISTORIAL ── */}
        {activeSection === 'historial' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AppointmentHistoryMedic
              appointments={historial}
              onActionSuccess={handleActionSuccess}
            />
          </motion.div>
        )}

        {/* ── PERFIL ── */}
        {activeSection === 'perfil' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <MedicProfile medico={medico} onUpdate={handleUpdateProfile} />
          </motion.div>
        )}

        {/* ── Modal tratamiento estructurado ── */}
        {treatmentModal && selectedAppointment && (
          <TreatmentForm
            appointment={selectedAppointment}
            paciente={{ nombre: selectedAppointment.paciente }}
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
