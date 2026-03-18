import { useState } from 'react';
import { motion } from 'framer-motion';
import { Size, SizeBox, CButton, Background } from "../styles/Styles";
import { Button1 } from "../components/Button1";
import { ApprovePatientsAdmin } from "../components/ApprovePatientsAdmin";
import { ApproveMedicsAdmin } from "../components/ApproveMedicsAdmin";
import { ViewPatientsAdmin } from "../components/ViewPatientsAdmin";
import { ViewMedicsAdmin } from "../components/ViewMedicsAdmin";

// DATOS QUEMADOS - REEMPLAZAR CON DATOS DEL BACKEND
import { 
  pacientesPendientesAprobacionMock,
  pacientesAprobadosMock,
  medicosPendientesAprobacionMock,
  medicosAprobadosMock
} from "../mock/dataMock";

export const DashboardAdmin = () => {
  // Estados para navegación
  const [activeSection, setActiveSection] = useState('aceptar_pacientes');

  // Estados para pacientes pendientes
  const [pacientesPendientes, setPacientesPendientes] = useState(pacientesPendientesAprobacionMock);
  const [pacientesAprobados, setPacientesAprobados] = useState(pacientesAprobadosMock);

  // Estados para médicos pendientes
  const [medicosPendientes, setMedicosPendientes] = useState(medicosPendientesAprobacionMock);
  const [medicosAprobados, setMedicosAprobados] = useState(medicosAprobadosMock);

  // ============ MANEJADORES PARA PACIENTES PENDIENTES ============

  const handleApprovePaciente = (pacienteId) => {
    const paciente = pacientesPendientes.find(p => p.id_paciente === pacienteId);
    if (!paciente) return;

    console.log('✅ Paciente aprobado:', paciente.nombre, paciente.correo);

    setPacientesPendientes(
      pacientesPendientes.filter(p => p.id_paciente !== pacienteId)
    );
    setPacientesAprobados([
      ...pacientesAprobados,
      { ...paciente, estado: 'Aprobado' }
    ]);
  };

  const handleRejectPaciente = (pacienteId) => {
    const paciente = pacientesPendientes.find(p => p.id_paciente === pacienteId);
    if (!paciente) return;

    console.log('❌ Paciente rechazado:', paciente.nombre, paciente.correo);

    setPacientesPendientes(
      pacientesPendientes.filter(p => p.id_paciente !== pacienteId)
    );
  };

  // ============ MANEJADORES PARA MÉDICOS PENDIENTES ============

  const handleApproveMedico = (medicoId) => {
    const medico = medicosPendientes.find(m => m.id_medico === medicoId);
    if (!medico) return;

    console.log('✅ Médico aprobado:', medico.nombre, medico.correo);

    setMedicosPendientes(
      medicosPendientes.filter(m => m.id_medico !== medicoId)
    );
    setMedicosAprobados([
      ...medicosAprobados,
      { ...medico, estado: 'Aprobado' }
    ]);
  };

  const handleRejectMedico = (medicoId) => {
    const medico = medicosPendientes.find(m => m.id_medico === medicoId);
    if (!medico) return;

    console.log('❌ Médico rechazado:', medico.nombre, medico.correo);

    setMedicosPendientes(
      medicosPendientes.filter(m => m.id_medico !== medicoId)
    );
  };

  // ============ MANEJADORES PARA PACIENTES APROBADOS ============

  const handleDeactivatePaciente = (pacienteId, razon) => {
    const paciente = pacientesAprobados.find(p => p.id_paciente === pacienteId);
    if (!paciente) return;

    console.log(`🚫 Paciente dado de baja: ${paciente.nombre}, Motivo: ${razon}`);

    // Aquí se enviaría a backend
  };

  // ============ MANEJADORES PARA MÉDICOS APROBADOS ============

  const handleDeactivateMedico = (medicoId, razon) => {
    const medico = medicosAprobados.find(m => m.id_medico === medicoId);
    if (!medico) return;

    console.log(`🚫 Médico dado de baja: ${medico.nombre}, Motivo: ${razon}`);

    // Aquí se enviaría a backend
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
            <h1 className={`${Size.EXTRALARGE} text-gray-800`}>Panel Administrador</h1>
            <p className={`${Size.MEDIUM} text-gray-600`}>Gestiona solicitudes de pacientes y configuración del sistema</p>
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
          {/* Botón: Aceptar Pacientes */}
          <button
            onClick={() => setActiveSection('aceptar_pacientes')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeSection === 'aceptar_pacientes'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Aceptar Pacientes ({pacientesPendientes.length})
          </button>

          {/* Botón: Aceptar Médicos */}
          <button
            onClick={() => setActiveSection('aceptar_medicos')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeSection === 'aceptar_medicos'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Aceptar Médicos ({medicosPendientes.length})
          </button>

          {/* Botón: Ver Pacientes */}
          <button
            onClick={() => setActiveSection('ver_pacientes')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeSection === 'ver_pacientes'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ver Pacientes ({pacientesAprobados.length})
          </button>

          {/* Botón: Ver Médicos */}
          <button
            onClick={() => setActiveSection('ver_medicos')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeSection === 'ver_medicos'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ver Médicos ({medicosAprobados.length})
          </button>
        </motion.div>

        {/* Secciones de Contenido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg p-8 shadow-md"
        >
          {/* Sección: Aceptar Pacientes */}
          {activeSection === 'aceptar_pacientes' && (
            <ApprovePatientsAdmin
              pacientesPendientes={pacientesPendientes}
              onApprove={handleApprovePaciente}
              onReject={handleRejectPaciente}
            />
          )}

          {/* Sección: Aceptar Médicos */}
          {activeSection === 'aceptar_medicos' && (
            <ApproveMedicsAdmin
              medicosPendientes={medicosPendientes}
              onApprove={handleApproveMedico}
              onReject={handleRejectMedico}
            />
          )}

          {/* Sección: Ver Pacientes */}
          {activeSection === 'ver_pacientes' && (
            <ViewPatientsAdmin
              pacientesAprobados={pacientesAprobados}
              onDeactivate={handleDeactivatePaciente}
            />
          )}

          {/* Sección: Ver Médicos */}
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
