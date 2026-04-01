import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Size, CButton, Background } from "../styles/Styles";
import { Button1 } from "../components/Button1";
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
    'Authorization': `Bearer ${token}`
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

    } catch (err) {
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

  // Atender cita — abre el modal
  const handleAttendClick = (appointment) => {
    setSelectedAppointment(appointment);
    setTreatmentModal(true);
  };

  // Guardar tratamiento → PUT /api/medicos/citas/{id}/atender
  const handleSaveTreatment = async (treatment) => {
    try {
      const res = await fetch(`${API}/api/medicos/citas/${selectedAppointment.id_cita}/atender`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ tratamiento: treatment }),
      });

      if (!res.ok) {
        const datos = await res.json();
        alert(datos.detail || 'Error al guardar tratamiento');
        return;
      }

      await cargarDatos(); // Recarga citas y historial
      setTreatmentModal(false);
      setSelectedAppointment(null);

    } catch (err) {
      alert('Error de conexión.');
    }
  };

  // Cancelar cita → PUT /api/medicos/citas/{id}/cancelar
  const handleCancelAppointment = async (appointmentId) => {
    try {
      const res = await fetch(`${API}/api/medicos/citas/${appointmentId}/cancelar`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ motivo_cancelacion: 'Cancelado por el médico' }),
      });

      if (!res.ok) {
        const datos = await res.json();
        alert(datos.detail || 'Error al cancelar');
        return;
      }

      await cargarDatos();
      setCancelingId(null);

    } catch (err) {
      alert('Error de conexión.');
    }
  };

  const handleSectionChange = async (key) => {
    setActiveSection(key);
    await cargarDatos(); // recarga datos frescos al cambiar sección
  };

  // Actualizar horario → POST /api/medicos/horarios
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
        alert(datos.detail || 'Error al actualizar horario');
        return;
      }

      await cargarDatos(); // Recarga perfil con nuevo horario
      return true;

    } catch (err) {
      throw err; // Re-lanza para que SetSchedule lo muestre
    }
  };

  // Actualizar perfil → PUT /api/medicos/perfil
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

      const datosPerfil = await res.json();
      setMedico(datosPerfil);

    } catch (err) {
      alert('Error de conexión.');
    }
  };

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
            <h1 className={`${Size.EXTRALARGE} text-gray-800`}>
              Bienvenido, {medico.nombre} {medico.apellido}
            </h1>
            <p className={`${Size.MEDIUM} text-gray-600`}>Gestiona tus citas y horarios</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
          >
            Cerrar sesión
          </button>
        </motion.div>

        {/* Navegación */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 mb-8 bg-white rounded-lg p-4 shadow-md"
        >
          {[
            { key: 'citas_pendientes', label: `Citas Pendientes (${citas.length})` },
            { key: 'horarios', label: 'Mis Horarios' },
            { key: 'historial', label: 'Historial de Citas' },
            { key: 'perfil', label: 'Mi Perfil' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSectionChange(key)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${activeSection === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* CITAS PENDIENTES */}
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

        {/* HORARIOS */}
        {activeSection === 'horarios' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SetSchedule medico={medico} onUpdate={handleUpdateSchedule} />
          </motion.div>
        )}

        {/* HISTORIAL */}
        {activeSection === 'historial' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AppointmentHistoryMedic appointments={historial} />
          </motion.div>
        )}

        {/* PERFIL */}
        {activeSection === 'perfil' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <MedicProfile medico={medico} onUpdate={handleUpdateProfile} />
          </motion.div>
        )}

        {/* Modal tratamiento */}
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