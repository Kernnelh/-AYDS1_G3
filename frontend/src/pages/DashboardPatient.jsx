import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdSearch, MdClose, MdLogout } from 'react-icons/md';
import { Size, Background } from "../styles/styles";
import { DoctorCard } from "../components/DoctorCard";
import { DoctorSchedule } from "../components/DoctorSchedule";
import { BookAppointment } from "../components/BookAppointment";
import { ActiveAppointments } from "../components/ActiveAppointments";
import { AppointmentHistory } from "../components/AppointmentHistory";
import { PatientProfile } from "../components/PatientProfile";
import { TreatmentView } from "../components/TreatmentView";   // NUEVO

const API = 'http://127.0.0.1:8000';

export const DashboardPatient = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // ── Navegación ──
  const [activeSection, setActiveSection] = useState('medicos');

  // ── Médicos ──
  const [medicos, setMedicos] = useState([]);
  const [filteredMedicos, setFilteredMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [searchEspecialidad, setSearchEspecialidad] = useState('');

  // ── Interacción médico ──
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);

  // ── Citas y paciente ──
  const [citas, setCitas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [paciente, setPaciente] = useState({ nombre: '', apellido: '' });

  // ── Estado general ──
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // ── Toast de éxito (para calificar/reportar) ──
  const [toastMsg, setToastMsg] = useState('');

  // ── Carga inicial ──
  useEffect(() => {
    if (!token) { navigate('/'); return; }
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    setCargando(true);
    try {
      const [resMedicos, resCitas, resHistorial, resPerfil] = await Promise.all([
        fetch(`${API}/api/medicos-disponibles`, { headers: authHeaders }),
        fetch(`${API}/api/citas/activas`, { headers: authHeaders }),
        fetch(`${API}/pacientes/citas/historial`, { headers: authHeaders }),
        fetch(`${API}/pacientes/perfil`, { headers: authHeaders }),
      ]);

      if (resMedicos.status === 401) { handleLogout(); return; }

      const datosMedicos = await resMedicos.json();
      const datosCitas = await resCitas.json();
      const datosHistorial = await resHistorial.json();
      const datosPerfil = await resPerfil.json();

      setMedicos(datosMedicos);
      setFilteredMedicos(datosMedicos);
      setEspecialidades([...new Set(datosMedicos.map(m => m.especialidad))]);
      setCitas(datosCitas);
      setHistorial(datosHistorial);
      setPaciente(datosPerfil);
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  // ── Logout ──
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    navigate('/');
  };

  // ── Búsqueda ──
  const handleSearchEspecialidad = (e) => {
    e.preventDefault();
    if (searchEspecialidad.trim() === '') {
      setFilteredMedicos(medicos);
    } else {
      setFilteredMedicos(
        medicos.filter(m =>
          m.especialidad.toLowerCase().includes(searchEspecialidad.toLowerCase())
        )
      );
    }
  };

  // ── Cambio de sección ──
  const handleSectionChange = async (key) => {
    setActiveSection(key);
    if (key === 'medicos') {
      setShowDoctorDetails(false);
      setFilteredMedicos(medicos);
      setSearchEspecialidad('');
    }
    // Refrescamos historial al entrar en esa sección (para ver estados calificado/reportado)
    if (key === 'historial') {
      try {
        const res = await fetch(`${API}/pacientes/citas/historial`, { headers: authHeaders });
        if (res.ok) setHistorial(await res.json());
      } catch { /* silencioso */ }
    }
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorDetails(true);
    setActiveSection('horario');
  };

  // ── Agendar cita ──
  const handleBookAppointment = async (newAppointment) => {
    try {
      const res = await fetch(`${API}/api/citas`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(newAppointment),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.detail || 'Error al agendar la cita');

      const resCitas = await fetch(`${API}/api/citas/activas`, { headers: authHeaders });
      setCitas(await resCitas.json());

      setShowDoctorDetails(false);
      setSelectedDoctor(null);
      setActiveSection('citas_activas');
    } catch (err) {
      throw err;
    }
  };

  // ── Cancelar cita ──
  const handleCancelAppointment = async (appointmentId) => {
    try {
      const res = await fetch(`${API}/api/citas/${appointmentId}/cancelar`, {
        method: 'PUT',
        headers: authHeaders,
      });
      if (!res.ok) {
        const datos = await res.json();
        alert(datos.detail || 'Error al cancelar la cita');
        return;
      }

      const [resCitas, resHistorial, resMedicos] = await Promise.all([
        fetch(`${API}/api/citas/activas`, { headers: authHeaders }),
        fetch(`${API}/pacientes/citas/historial`, { headers: authHeaders }),
        fetch(`${API}/api/medicos-disponibles`, { headers: authHeaders }),
      ]);

      const nuevosMedicos = await resMedicos.json();
      setCitas(await resCitas.json());
      setHistorial(await resHistorial.json());
      setMedicos(nuevosMedicos);
      setFilteredMedicos(nuevosMedicos);
      setEspecialidades([...new Set(nuevosMedicos.map(m => m.especialidad))]);
    } catch {
      alert('Error de conexión al cancelar la cita.');
    }
  };

  // ── Toast tras calificar / reportar ──
  const handleActionSuccess = async (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
    // Refrescamos historial para que los botones cambien a "ya hecho"
    try {
      const res = await fetch(`${API}/pacientes/citas/historial`, { headers: authHeaders });
      if (res.ok) setHistorial(await res.json());
    } catch { /* silencioso */ }
  };

  const handleUpdateProfile = (updatedProfile) => {
    setPaciente(updatedProfile);
  };

  // ── Tabs de navegación ──
  const NAV_TABS = [
    { key: 'medicos',       label: 'Médicos' },
    { key: 'citas_activas', label: 'Citas Activas' },
    { key: 'historial',     label: 'Historial de Citas' },
    { key: 'tratamiento',   label: 'Mi Tratamiento' },   // NUEVO
    { key: 'perfil',        label: 'Mi Perfil' },
  ];

  // ── Loading / Error ──
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${Background.BACKGROUND} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">

        {/* Toast global */}
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
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
              Bienvenido, {paciente.nombre}
            </h1>
            <p className={`${Size.MEDIUM} text-gray-600`}>Gestiona tus citas médicas</p>
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

        {/* ── SECCIÓN: MÉDICOS ── */}
        {activeSection === 'medicos' && !showDoctorDetails && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-lg p-6 shadow-md mb-8">
              <h2 className={`${Size.LARGE} mb-4 text-gray-800`}>Buscar Médico por Especialidad</h2>
              <form onSubmit={handleSearchEspecialidad} className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Escribe la especialidad..."
                  value={searchEspecialidad}
                  onChange={(e) => setSearchEspecialidad(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-semibold flex items-center gap-2"
                >
                  <MdSearch /> Buscar
                </button>
              </form>

              <div className="mt-4">
                <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>O selecciona una especialidad:</label>
                <select
                  value={searchEspecialidad}
                  onChange={(e) => {
                    setSearchEspecialidad(e.target.value);
                    setFilteredMedicos(
                      e.target.value.trim() === ''
                        ? medicos
                        : medicos.filter(m =>
                            m.especialidad.toLowerCase().includes(e.target.value.toLowerCase())
                          )
                    );
                  }}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las especialidades</option>
                  {especialidades.map((esp, idx) => (
                    <option key={idx} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicos.map((doctor) => (
                <DoctorCard key={doctor.id_medico} doctor={doctor} onSelect={handleSelectDoctor} />
              ))}
            </div>

            {filteredMedicos.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className={`${Size.LARGE} text-gray-600`}>No se encontraron médicos con esa especialidad</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── SECCIÓN: DETALLES DEL MÉDICO ── */}
        {showDoctorDetails && selectedDoctor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <button
              onClick={() => { setShowDoctorDetails(false); setSelectedDoctor(null); setActiveSection('medicos'); }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-semibold flex items-center gap-2"
            >
              <MdClose /> Volver
            </button>
            <DoctorSchedule doctor={selectedDoctor} citas={citas} />
            <BookAppointment doctor={selectedDoctor} onBook={handleBookAppointment} existingAppointments={citas} />
          </motion.div>
        )}

        {/* ── SECCIÓN: CITAS ACTIVAS ── */}
        {activeSection === 'citas_activas' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ActiveAppointments appointments={citas} onCancel={handleCancelAppointment} />
          </motion.div>
        )}

        {/* ── SECCIÓN: HISTORIAL ── */}
        {activeSection === 'historial' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AppointmentHistory
              appointments={historial}
              onActionSuccess={handleActionSuccess}   // NUEVO prop
            />
          </motion.div>
        )}

        {/* ── SECCIÓN: MI TRATAMIENTO (NUEVO) ── */}
        {activeSection === 'tratamiento' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TreatmentView />
          </motion.div>
        )}

        {/* ── SECCIÓN: PERFIL ── */}
        {activeSection === 'perfil' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PatientProfile paciente={paciente} onUpdate={handleUpdateProfile} />
          </motion.div>
        )}

      </div>
    </div>
  );
};
