import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MdMedicalServices, MdPerson, MdCalendarToday,
  MdLocalPharmacy, MdPrint, MdRefresh, MdAssignment
} from 'react-icons/md';
import { Size } from "../styles/styles";

const API = 'http://127.0.0.1:8000';

export const TreatmentView = () => {
  const [tratamientos, setTratamientos] = useState([]); // Ahora es un arreglo
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [imprimiendoId, setImprimiendoId] = useState(null); // Trackeo de qué PDF se está generando

  const token = localStorage.getItem('token');
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  useEffect(() => {
    cargarTratamientos();
  }, []);

  const cargarTratamientos = async () => {
    setCargando(true);
    setError('');
    try {
      // Ajustado a la ruta que devuelve la lista de tratamientos del historial
      const res = await fetch(`${API}/pacientes/citas/historial`, { headers: authHeaders });
      
      if (!res.ok) {
        const datos = await res.json();
        setError(datos.detail || 'Error al cargar los tratamientos.');
        return;
      }
      
      const datos = await res.json();
      // Filtramos solo los que tienen id_tratamiento (los que fueron atendidos)
      const soloConTratamiento = datos.filter(cita => cita.id_tratamiento !== null);
      setTratamientos(soloConTratamiento);
    } catch {
      setError('Error de conexión al cargar el historial.');
    } finally {
      setCargando(false);
    }
  };

  const handleImprimirPdf = async (id_tratamiento, nombre_medico) => {
    setImprimiendoId(id_tratamiento);
    try {
      const res = await fetch(`${API}/pacientes/tratamiento/${id_tratamiento}/receta`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!res.ok) {
        alert('Error al generar el PDF.');
        return;
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receta_${nombre_medico.replace(/ /g, '_')}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Error de conexión al generar el PDF.');
    } finally {
      setImprimiendoId(null);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        <p className="ml-4 text-gray-500">Cargando tus tratamientos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={cargarTratamientos} className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <MdRefresh /> Reintentar
        </button>
      </div>
    );
  }

  if (tratamientos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <MdMedicalServices size={56} className="text-gray-300 mx-auto mb-4" />
        <p className={`${Size.LARGE} text-gray-500`}>No tienes tratamientos registrados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className={`${Size.EXTRALARGE} font-bold text-gray-800 flex items-center gap-2`}>
          <MdAssignment className="text-blue-500" />
          Mis Tratamientos Anteriores
        </h2>
        <p className={`${Size.MEDIUM} text-gray-500 mt-1`}>
          Consulta y descarga las recetas de tus consultas finalizadas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tratamientos.map((cita) => (
          <motion.div
            key={cita.id_cita}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`${Size.LARGE} font-bold text-gray-800`}>
                    {cita.medico}
                  </h3>
                  <p className="text-blue-500 font-medium text-sm">{cita.especialidad}</p>
                </div>
                <button
                  onClick={() => handleImprimirPdf(cita.id_tratamiento, cita.medico)}
                  disabled={imprimiendoId === cita.id_tratamiento}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition disabled:opacity-50"
                >
                  <MdPrint />
                  {imprimiendoId === cita.id_tratamiento ? '...' : 'PDF'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MdCalendarToday className="text-gray-400" />
                  <span>{new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-ES')}</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold">Dirección:</span> {cita.direccion_clinica}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Diagnóstico</p>
                <p className="text-gray-700 text-sm italic">"{cita.tratamiento}"</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};