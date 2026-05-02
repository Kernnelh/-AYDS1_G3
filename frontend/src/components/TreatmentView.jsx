import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MdMedicalServices, MdPerson, MdCalendarToday,
  MdLocalPharmacy, MdPrint, MdRefresh
} from 'react-icons/md';
import { Size } from "../styles/styles";

const API = 'http://127.0.0.1:8000';

export const TreatmentView = () => {
  const [tratamiento, setTratamiento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [generandoPdf, setGenerandoPdf] = useState(false);

  const token = localStorage.getItem('token');
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  useEffect(() => {
    cargarTratamiento();
  }, []);

  const cargarTratamiento = async () => {
    setCargando(true);
    setError('');
    try {
      const res = await fetch(`${API}/pacientes/tratamiento`, { headers: authHeaders });
      if (res.status === 404) {
        setTratamiento(null);
        return;
      }
      if (!res.ok) {
        const datos = await res.json();
        setError(datos.detail || 'Error al cargar el tratamiento.');
        return;
      }
      const datos = await res.json();
      setTratamiento(datos);
    } catch {
      setError('Error de conexión al cargar el tratamiento.');
    } finally {
      setCargando(false);
    }
  };

// Genera e imprime el PDF de la receta usando la API del backend
  const handleImprimirPdf = async () => {
    setGenerandoPdf(true);
    try {
      // CAMBIO AQUÍ: Agregamos /api/ y usamos el id_tratamiento del estado
      const res = await fetch(`${API}/api/pacientes/tratamiento/${tratamiento.id_tratamiento}/receta`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        alert('Error al generar el PDF. Verifica que el tratamiento exista.');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receta_${tratamiento.nombre_medico}.pdf`; // Le puse un nombre más dinámico
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Error de conexión al generar el PDF.');
    } finally {
      setGenerandoPdf(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        <p className="ml-4 text-gray-500">Cargando tratamiento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={cargarTratamiento}
          className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <MdRefresh /> Reintentar
        </button>
      </div>
    );
  }

  if (!tratamiento) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <MdMedicalServices size={56} className="text-gray-300 mx-auto mb-4" />
        <p className={`${Size.LARGE} text-gray-500`}>
          No tienes un tratamiento activo actualmente.
        </p>
        <p className={`${Size.MEDIUM} text-gray-400 mt-2`}>
          Aquí aparecerá tu tratamiento una vez que el médico lo registre después de atenderte.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Encabezado */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h2 className={`${Size.EXTRALARGE} font-bold text-gray-800 flex items-center gap-2`}>
              <MdMedicalServices className="text-blue-500" />
              Mi Tratamiento Activo
            </h2>
            <p className={`${Size.MEDIUM} text-gray-500 mt-1`}>
              Información completa de tu tratamiento médico actual
            </p>
          </div>
          <button
            onClick={handleImprimirPdf}
            disabled={generandoPdf}
            className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold transition disabled:opacity-60"
          >
            <MdPrint />
            {generandoPdf ? 'Generando...' : 'Imprimir Receta'}
          </button>
        </div>
      </div>

      {/* Info del médico */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className={`${Size.LARGE} font-bold text-gray-700 mb-4 flex items-center gap-2`}>
          <MdPerson className="text-blue-400" /> Información del Médico
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className={`${Size.MEDIUM} text-blue-600 font-semibold`}>Médico</p>
            <p className={`${Size.MEDIUM} text-gray-800 font-bold mt-1`}>{tratamiento.nombre_medico}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className={`${Size.MEDIUM} text-blue-600 font-semibold`}>Especialidad</p>
            <p className={`${Size.MEDIUM} text-gray-800 font-bold mt-1`}>{tratamiento.especialidad}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className={`${Size.MEDIUM} text-blue-600 font-semibold`}>No. Colegiado</p>
            <p className={`${Size.MEDIUM} text-gray-800 font-bold mt-1`}>{tratamiento.numero_colegiado}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-gray-500">
          <MdCalendarToday />
          <p className={`${Size.MEDIUM}`}>
            Última cita:{' '}
            <span className="font-semibold text-gray-700">
              {new Date(tratamiento.fecha_ultima_cita + 'T00:00:00').toLocaleDateString('es-ES', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
          </p>
        </div>
      </div>

      {/* Diagnóstico */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className={`${Size.LARGE} font-bold text-gray-700 mb-3`}>🩺 Diagnóstico</h3>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4">
          <p className={`${Size.MEDIUM} text-gray-800`}>{tratamiento.diagnostico}</p>
        </div>
      </div>

      {/* Medicamentos */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className={`${Size.LARGE} font-bold text-gray-700 mb-4 flex items-center gap-2`}>
          <MdLocalPharmacy className="text-green-500" /> Medicamentos Recetados
        </h3>

        {tratamiento.medicamentos && tratamiento.medicamentos.length > 0 ? (
          <div className="space-y-4">
            {tratamiento.medicamentos.map((med, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="border border-green-100 rounded-xl p-4 bg-green-50"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <p className={`${Size.LARGE} font-bold text-gray-800`}>{med.nombre}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className={`${Size.MEDIUM} text-green-700 font-semibold`}>Cantidad</p>
                    <p className={`${Size.MEDIUM} text-gray-700`}>{med.cantidad}</p>
                  </div>
                  <div>
                    <p className={`${Size.MEDIUM} text-green-700 font-semibold`}>Duración</p>
                    <p className={`${Size.MEDIUM} text-gray-700`}>{med.tiempo}</p>
                  </div>
                  <div className="md:col-span-3 md:border-t md:border-green-200 md:pt-3 mt-2 md:mt-0">
                    <p className={`${Size.MEDIUM} text-green-700 font-semibold`}>Instrucciones</p>
                    <p className={`${Size.MEDIUM} text-gray-700`}>{med.descripcion_dosis}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className={`${Size.MEDIUM} text-gray-400`}>Sin medicamentos registrados.</p>
        )}
      </div>
    </motion.div>
  );
};
