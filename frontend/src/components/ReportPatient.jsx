import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdSend, MdWarning } from 'react-icons/md';
import { Size } from "../styles/styles";

const API = 'http://127.0.0.1:8000';

const CATEGORIAS = [
  'Conducta inapropiada durante la consulta',
  'Falsificación de documentos',
  'Agresión verbal o física',
  'Robo o daño a las instalaciones',
  'Incumplimiento de tratamiento indicado',
  'Comportamiento irrespetuoso al personal',
];

export const ReportPatient = ({ appointment, onClose, onSuccess }) => {
  const [categoria, setCategoria] = useState('');
  const [explicacion, setExplicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!categoria) {
      setError('Por favor selecciona una categoría.');
      return;
    }
    if (!explicacion.trim() || explicacion.trim().length < 20) {
      setError('La explicación debe tener al menos 20 caracteres.');
      return;
    }

    const token = localStorage.getItem('token');
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/api/citas/${appointment.id_cita}/reportar-paciente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ categoria, explicacion }),
      });

      const datos = await res.json();

      if (!res.ok) {
        setError(datos.detail || 'Error al enviar el reporte.');
        return;
      }

      onSuccess('Reporte del paciente enviado al administrador.');
      onClose();
    } catch {
      setError('Error de conexión al enviar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <MdWarning size={22} className="text-red-500" />
              <h3 className={`${Size.LARGE} font-bold text-gray-800`}>
                Reportar a {appointment.paciente}
              </h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <MdClose size={24} />
            </button>
          </div>

          <p className={`${Size.MEDIUM} text-gray-500 mb-5`}>
            Este reporte será enviado al administrador para su revisión.
          </p>

          {/* Categoría */}
          <div className="mb-4">
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2 font-semibold`}>
              Categoría del reporte: <span className="text-red-500">*</span>
            </label>
            <select
              value={categoria}
              onChange={(e) => { setCategoria(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">-- Selecciona una categoría --</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Explicación */}
          <div className="mb-4">
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2 font-semibold`}>
              Explicación detallada: <span className="text-red-500">*</span>
            </label>
            <textarea
              value={explicacion}
              onChange={(e) => { setExplicacion(e.target.value); setError(''); }}
              placeholder="Describe con detalle el motivo del reporte (mínimo 20 caracteres)..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
            <p className={`${Size.SMALL} text-gray-400 mt-1 text-right`}>
              {explicacion.length} caracteres
            </p>
          </div>

          {error && <p className={`${Size.MEDIUM} text-red-600 mb-3`}>{error}</p>}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              <MdSend />
              {loading ? 'Enviando...' : 'Enviar Reporte'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
