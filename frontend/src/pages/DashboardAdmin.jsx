import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Size, Background, CButton } from "../styles/Styles";
import { Button1 } from "../components/Button1";
import { ApprovePatientsAdmin } from "../components/ApprovePatientsAdmin";
import { ApproveMedicsAdmin } from "../components/ApproveMedicsAdmin";
import { ViewPatientsAdmin } from "../components/ViewPatientsAdmin";
import { ViewMedicsAdmin } from "../components/ViewMedicsAdmin";

export const DashboardAdmin = () => {
  const [activeSection, setActiveSection] = useState('aceptar_pacientes');

  const [pacientesPendientes, setPacientesPendientes] = useState([]);
  const [pacientesAprobados, setPacientesAprobados] = useState([]);
  const [medicosPendientes, setMedicosPendientes] = useState([]);
  const [medicosAprobados, setMedicosAprobados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Token guardado en localStorage al hacer login
  const token = localStorage.getItem('token');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // ============ CARGA INICIAL DE DATOS ============
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pendientes (pacientes y médicos en un solo endpoint)
      const resPendientes = await fetch('http://127.0.0.1:8000/api/admin/pendientes', { headers });
      const dataPendientes = await resPendientes.json();

      // Aprobados (dos endpoints separados)
      const resPacAprobados = await fetch('http://127.0.0.1:8000/api/admin/usuarios/paciente/aprobados', { headers });
      const dataPacAprobados = await resPacAprobados.json();

      const resMedAprobados = await fetch('http://127.0.0.1:8000/api/admin/usuarios/medico/aprobados', { headers });
      const dataMedAprobados = await resMedAprobados.json();

      setPacientesPendientes(dataPendientes.pacientes || []);
      setMedicosPendientes(dataPendientes.medicos || []);
      setPacientesAprobados(dataPacAprobados || []);
      setMedicosAprobados(dataMedAprobados || []);

    } catch (err) {
      console.error(err);
      setError('Error al cargar datos del servidor');
    } finally {
      setLoading(false);
    }
  };

  // ============ MANEJADORES PACIENTES PENDIENTES ============
  const handleApprovePaciente = async (pacienteId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/usuarios/paciente/${pacienteId}/estado`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ estado: 'Aprobado' })
      });
      if (res.ok) cargarDatos(); // Recargamos todo del backend
    } catch (err) {
      console.error('Error al aprobar paciente:', err);
    }
  };

  const handleRejectPaciente = async (pacienteId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/usuarios/paciente/${pacienteId}/estado`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ estado: 'Rechazado' })
      });
      if (res.ok) cargarDatos();
    } catch (err) {
      console.error('Error al rechazar paciente:', err);
    }
  };

  // ============ MANEJADORES MÉDICOS PENDIENTES ============
  const handleApproveMedico = async (medicoId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/usuarios/medico/${medicoId}/estado`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ estado: 'Aprobado' })
      });
      if (res.ok) cargarDatos();
    } catch (err) {
      console.error('Error al aprobar médico:', err);
    }
  };

  const handleRejectMedico = async (medicoId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/usuarios/medico/${medicoId}/estado`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ estado: 'Rechazado' })
      });
      if (res.ok) cargarDatos();
    } catch (err) {
      console.error('Error al rechazar médico:', err);
    }
  };

  // ============ MANEJADORES BAJA ============
  const handleDeactivatePaciente = async (pacienteId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/usuarios/paciente/${pacienteId}/baja`, {
        method: 'PATCH',
        headers
      });
      if (res.ok) cargarDatos();
    } catch (err) {
      console.error('Error al dar de baja paciente:', err);
    }
  };

  const handleDeactivateMedico = async (medicoId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/usuarios/medico/${medicoId}/baja`, {
        method: 'PATCH',
        headers
      });
      if (res.ok) cargarDatos();
    } catch (err) {
      console.error('Error al dar de baja médico:', err);
    }
  };

  const handleSectionChange = async (key) => {
    setActiveSection(key);
    await cargarDatos(); // recarga datos frescos al cambiar sección
  };

  // ============ RENDER ============
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg">Cargando datos...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500 text-lg">{error}</p>
    </div>
  );

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
            <h1 className={`${Size.EXTRALARGE} text-gray-800`}>Panel Administrador</h1>
            <p className={`${Size.MEDIUM} text-gray-600`}>Gestiona solicitudes de pacientes y configuración del sistema</p>
          </div>
          <Button1 nombre="Cerrar sesión" id="logout" type='link' link='/' color={CButton.MATE} />
        </motion.div>

        {/* Navegación */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 mb-8 bg-white rounded-lg p-4 shadow-md"
        >
          {[
            { key: 'aceptar_pacientes', label: 'Aceptar Pacientes', count: pacientesPendientes.length },
            { key: 'aceptar_medicos',   label: 'Aceptar Médicos',   count: medicosPendientes.length },
            { key: 'ver_pacientes',     label: 'Ver Pacientes',     count: pacientesAprobados.length },
            { key: 'ver_medicos',       label: 'Ver Médicos',       count: medicosAprobados.length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => handleSectionChange(key)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeSection === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </motion.div>

        {/* Contenido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-8 shadow-md"
        >
          {activeSection === 'aceptar_pacientes' && (
            <ApprovePatientsAdmin
              pacientesPendientes={pacientesPendientes}
              onApprove={handleApprovePaciente}
              onReject={handleRejectPaciente}
            />
          )}
          {activeSection === 'aceptar_medicos' && (
            <ApproveMedicsAdmin
              medicosPendientes={medicosPendientes}
              onApprove={handleApproveMedico}
              onReject={handleRejectMedico}
            />
          )}
          {activeSection === 'ver_pacientes' && (
            <ViewPatientsAdmin
              pacientesAprobados={pacientesAprobados}
              onDeactivate={handleDeactivatePaciente}
            />
          )}
          {activeSection === 'ver_medicos' && (
            <ViewMedicsAdmin
              medicosAprobados={medicosAprobados}
              onDeactivate={handleDeactivateMedico}
            />
          )}
        </motion.div>

      </div>
    </div>
  );
};