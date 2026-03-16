import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdSearch, MdClose, MdLogout } from 'react-icons/md';
import { Size, SizeBox, CButton, Background } from "../styles/Styles";
import { Button1 } from "../components/Button1";
import { DoctorCard } from "../components/DoctorCard";
import { DoctorSchedule } from "../components/DoctorSchedule";
import { BookAppointment } from "../components/BookAppointment";
import { ActiveAppointments } from "../components/ActiveAppointments";
import { AppointmentHistory } from "../components/AppointmentHistory";
import { PatientProfile } from "../components/PatientProfile";

// DATOS QUEMADOS - REEMPLAZAR CON DATOS DEL BACKEND
import { medicosMock, citasMock, pacienteMock } from "../mock/dataMock";

export const DashboardPatient = () => {
  // Estados para navegación de secciones
  const [activeSection, setActiveSection] = useState('medicos'); // medicos, horario, agendar, citas_activas, historial, perfil

  // Estados para los médicos
  const [medicos, setMedicos] = useState(medicosMock);
  const [filteredMedicos, setFilteredMedicos] = useState(medicosMock);
  const [especialidades, setEspecialidades] = useState([...new Set(medicosMock.map(m => m.especialidad))]);
  const [searchEspecialidad, setSearchEspecialidad] = useState('');

  // Estados para interacción con médicos
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);

  // Estados para citas
  const [citas, setCitas] = useState(citasMock);
  const [paciente, setPaciente] = useState(pacienteMock);

  // Manejadores de búsqueda
  const handleSearchEspecialidad = (e) => {
    e.preventDefault();
    if (searchEspecialidad.trim() === '') {
      setFilteredMedicos(medicos);
    } else {
      const filtered = medicos.filter(medico =>
        medico.especialidad.toLowerCase().includes(searchEspecialidad.toLowerCase())
      );
      setFilteredMedicos(filtered);
    }
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorDetails(true);
    setActiveSection('horario');
  };

  const handleBookAppointment = (newAppointment) => {
    setCitas([...citas, newAppointment]);
    setShowDoctorDetails(false);
    setSelectedDoctor(null);
    setActiveSection('citas_activas');
  };

  const handleCancelAppointment = (appointmentId) => {
    const updatedCitas = citas.map(cita =>
      cita.id_cita === appointmentId
        ? { ...cita, estado: 'Cancelada_Paciente', fecha_cancelacion: new Date().toISOString() }
        : cita
    );
    setCitas(updatedCitas);
  };

  const handleUpdateProfile = (updatedProfile) => {
    setPaciente(updatedProfile);
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
            <h1 className={`${Size.EXTRALARGE} text-gray-800`}>Bienvenido, {paciente.nombre}</h1>
            <p className={`${Size.MEDIUM} text-gray-600`}>Gestiona tus citas médicas</p>
          </div>
          <div className="flex gap-4">
            <Button1 
              nombre="Cerrar sesión" 
              id="logout"
              type='link' 
              link='/'
              color={CButton.MATE}
              icon={<MdLogout />}
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
            onClick={() => {
              setActiveSection('medicos');
              setShowDoctorDetails(false);
              setFilteredMedicos(medicos);
              setSearchEspecialidad('');
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeSection === 'medicos'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Médicos
          </button>
          <button
            onClick={() => setActiveSection('citas_activas')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeSection === 'citas_activas'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Citas Activas
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

        {/* SECCIÓN: LISTA DE MÉDICOS */}
        {activeSection === 'medicos' && !showDoctorDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Buscador de especialidades */}
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

              {/* Filtro por ComboBox */}
              <div className="mt-4">
                <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>O selecciona una especialidad:</label>
                <select
                  value={searchEspecialidad}
                  onChange={(e) => {
                    setSearchEspecialidad(e.target.value);
                    if (e.target.value.trim() === '') {
                      setFilteredMedicos(medicos);
                    } else {
                      const filtered = medicos.filter(medico =>
                        medico.especialidad.toLowerCase().includes(e.target.value.toLowerCase())
                      );
                      setFilteredMedicos(filtered);
                    }
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

            {/* Grid de médicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicos.map((doctor) => (
                <DoctorCard
                  key={doctor.id_medico}
                  doctor={doctor}
                  onSelect={handleSelectDoctor}
                />
              ))}
            </div>

            {filteredMedicos.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className={`${Size.LARGE} text-gray-600`}>No se encontraron médicos con esa especialidad</p>
              </div>
            )}
          </motion.div>
        )}

        {/* SECCIÓN: DETALLES DEL MÉDICO (Horario y Agendar) */}
        {showDoctorDetails && selectedDoctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <button
              onClick={() => {
                setShowDoctorDetails(false);
                setSelectedDoctor(null);
                setActiveSection('medicos');
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-semibold flex items-center gap-2"
            >
              <MdClose /> Volver
            </button>

            <DoctorSchedule doctor={selectedDoctor} citas={citas} />
            <BookAppointment
              doctor={selectedDoctor}
              onBook={handleBookAppointment}
              existingAppointments={citas}
            />
          </motion.div>
        )}

        {/* SECCIÓN: CITAS ACTIVAS */}
        {activeSection === 'citas_activas' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ActiveAppointments
              appointments={citas}
              onCancel={handleCancelAppointment}
              medicos={medicos}
            />
          </motion.div>
        )}

        {/* SECCIÓN: HISTORIAL DE CITAS */}
        {activeSection === 'historial' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AppointmentHistory
              appointments={citas}
              medicos={medicos}
            />
          </motion.div>
        )}

        {/* SECCIÓN: PERFIL */}
        {activeSection === 'perfil' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <PatientProfile
              paciente={paciente}
              onUpdate={handleUpdateProfile}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};