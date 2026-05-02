import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Size, Background, CButton } from "../styles/styles";
import { Button1 } from "../components/Button1";
import { ApprovePatientsAdmin } from "../components/ApprovePatientsAdmin";
import { ApproveMedicsAdmin } from "../components/ApproveMedicsAdmin";
import { ViewPatientsAdmin } from "../components/ViewPatientsAdmin";
import { ViewMedicsAdmin } from "../components/ViewMedicsAdmin";
//imports graficas reportes
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  // Graficas reportes
  const [analiticas, setAnaliticas] = useState({
    rendimientoMedicos: [],
    incidentes: [],
    promedioGlobal: 0,
    totalCalificaciones: 0,
    usuariosActivos: { pacientes_activos: [], medicos_activos: [], total_activos: 0 }
  });
  const [cargandoAnaliticas, setCargandoAnaliticas] = useState(false);

  //REPORTES
  const [descargando, setDescargando] = useState(null); // null | 'medicos' | 'especialidades'

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
    if (key === 'analiticas') {
      await cargarAnaliticas();
    } else {
      await cargarDatos(); // carga datos frescos al cambiar de seccion
    }
  };

  //REPORTES
  const descargarReporte = async (endpoint, nombreArchivo, tipo) => {
    setDescargando(tipo);
    try {
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        alert('Error al generar el reporte. Intenta de nuevo.');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      alert('Error de conexión al generar el reporte.');
    } finally {
      setDescargando(null);
    }
  };

  // =========== CARGA GRAFICAS ANALÍTICAS ============
  const cargarAnaliticas = async () => {
    setCargandoAnaliticas(true);
    try {
      const [resRendimiento, resIncidentes, resPromedios, resActivos] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/admin/reportes/analiticas/rendimiento-medicos', { headers }),
        fetch('http://127.0.0.1:8000/api/admin/reportes/analiticas/incidentes', { headers }),
        fetch('http://127.0.0.1:8000/api/admin/calificaciones/promedios', { headers }),
        fetch('http://127.0.0.1:8000/api/admin/usuarios/activos', { headers }),
      ]);

      const rendimiento = await resRendimiento.json();
      const incidentes = await resIncidentes.json();
      const promedios = await resPromedios.json();
      const activos = await resActivos.json();

      setAnaliticas({
        rendimientoMedicos: rendimiento.data_grafico || [],
        incidentes: incidentes.data_grafico || [],
        promedioGlobal: promedios.promedio_global || 0,
        totalCalificaciones: promedios.total_calificaciones || 0,
        usuariosActivos: activos
      });
    } catch (err) {
      console.error('Error al cargar analíticas:', err);
    } finally {
      setCargandoAnaliticas(false);
    }
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
            { key: 'aceptar_medicos', label: 'Aceptar Médicos', count: medicosPendientes.length },
            { key: 'ver_pacientes', label: 'Ver Pacientes', count: pacientesAprobados.length },
            { key: 'ver_medicos', label: 'Ver Médicos', count: medicosAprobados.length },
            { key: 'reportes', label: 'Reportes', count: null },
            { key: 'analiticas', label: 'Analíticas', count: null },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => handleSectionChange(key)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${activeSection === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {label} {count !== null && `(${count})`}
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
          {activeSection === 'reportes' && (
            <div className="space-y-6">
              <h2 className={`${Size.EXTRALARGE} font-bold text-gray-800`}>
                Generar Reportes
              </h2>
              <p className={`${Size.MEDIUM} text-gray-600`}>
                Descarga reportes en PDF con información relevante del sistema
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                {/* Reporte 1 */}
                <div className="border border-gray-200 rounded-lg p-6 space-y-3">
                  <h3 className={`${Size.LARGE} font-bold text-gray-800`}>
                    Reporte Médicos con más pacientes atendidos
                  </h3>
                  <p className={`${Size.MEDIUM} text-gray-600`}>
                    Ranking de médicos ordenados por cantidad de citas atendidas.
                  </p>
                  <button
                    onClick={() => descargarReporte(
                      '/api/admin/reportes/medicos-mas-atendidos',
                      'reporte_medicos_atendidos.pdf',
                      'medicos'
                    )}
                    disabled={descargando === 'medicos'}
                    className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${descargando === 'medicos'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                  >
                    {descargando === 'medicos' ? 'Generando...' : '⬇ Descargar PDF'}
                  </button>
                </div>

                {/* Reporte 2 */}
                <div className="border border-gray-200 rounded-lg p-6 space-y-3">
                  <h3 className={`${Size.LARGE} font-bold text-gray-800`}>
                    Reporte Especialidades más solicitadas
                  </h3>
                  <p className={`${Size.MEDIUM} text-gray-600`}>
                    Especialidades médicas ordenadas por número de citas generadas.
                  </p>
                  <button
                    onClick={() => descargarReporte(
                      '/api/admin/reportes/especialidades-mas-solicitadas',
                      'reporte_especialidades.pdf',
                      'especialidades'
                    )}
                    disabled={descargando === 'especialidades'}
                    className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${descargando === 'especialidades'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                  >
                    {descargando === 'especialidades' ? 'Generando...' : '⬇ Descargar PDF'}
                  </button>
                </div>

              </div>
            </div>
          )}
          {activeSection === 'analiticas' && (
            <div className="space-y-8">
              <h2 className={`${Size.EXTRALARGE} font-bold text-gray-800`}>
                Analíticas del Sistema
              </h2>

              {cargandoAnaliticas ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Cargando analíticas...</p>
                </div>
              ) : (
                <>
                  {/* Tarjetas de resumen */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-6 text-center">
                      <p className={`${Size.MEDIUM} text-blue-600 font-semibold`}>Promedio Global de Calificaciones</p>
                      <p className="text-4xl font-bold text-blue-700 mt-2">
                        {analiticas.promedioGlobal} ⭐
                      </p>
                      <p className={`${Size.MEDIUM} text-blue-500 mt-1`}>
                        {analiticas.totalCalificaciones} calificaciones totales
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6 text-center">
                      <p className={`${Size.MEDIUM} text-green-600 font-semibold`}>Pacientes Activos</p>
                      <p className="text-4xl font-bold text-green-700 mt-2">
                        {analiticas.usuariosActivos.pacientes_activos?.length || 0}
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-6 text-center">
                      <p className={`${Size.MEDIUM} text-purple-600 font-semibold`}>Médicos Activos</p>
                      <p className="text-4xl font-bold text-purple-700 mt-2">
                        {analiticas.usuariosActivos.medicos_activos?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Gráfica 1: Rendimiento de médicos */}
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-6`}>
                      ⭐ Rendimiento de Médicos por Calificación
                    </h3>
                    {analiticas.rendimientoMedicos.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No hay calificaciones registradas aún</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                          data={analiticas.rendimientoMedicos}
                          margin={{ top: 10, right: 30, left: 0, bottom: 80 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="medico"
                            angle={-35}
                            textAnchor="end"
                            interval={0}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis domain={[0, 5]} />
                          <Tooltip
                            formatter={(value, name) => [
                              name === 'promedio' ? `${value} ⭐` : value,
                              name === 'promedio' ? 'Promedio' : 'Evaluaciones'
                            ]}
                          />
                          <Legend />
                          <Bar dataKey="promedio" name="Promedio ⭐" fill="#f59e0b" />
                          <Bar dataKey="evaluaciones" name="Evaluaciones" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Gráfica 2: Incidentes por categoría */}
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-6`}>
                      ⚠️ Reportes de Incidentes por Categoría
                    </h3>
                    {analiticas.incidentes.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No hay reportes registrados aún</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                          data={analiticas.incidentes}
                          margin={{ top: 10, right: 30, left: 0, bottom: 80 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="categoria"
                            angle={-35}
                            textAnchor="end"
                            interval={0}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis allowDecimals={false} />
                          <Tooltip formatter={(value) => [value, 'Reportes']} />
                          <Bar dataKey="cantidad" name="Cantidad de Reportes" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                </>
              )}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};