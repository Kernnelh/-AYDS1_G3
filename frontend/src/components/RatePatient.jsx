import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdStar, MdStarBorder, MdClose, MdSend } from 'react-icons/md';
import { Size } from "../styles/styles";

const API = 'http://127.0.0.1:8000';

export const RatePatient = ({ appointment, onClose, onSuccess }) => {
  const [estrellas, setEstrellas] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (estrellas === 0) {
      setError('Por favor selecciona al menos 1 estrella.');
      return;
    }

    const token = localStorage.getItem('token');
    setLoading(true);
    setError('');

    try {
      // 1. Cambiamos la URL a la ruta correcta de medicos
      const res = await fetch(`${API}/api/medicos/calificar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          id_cita: appointment.id_cita, // 2. Agregamos el id_cita al body
          estrellas: estrellas, 
          comentario: comentario 
        }),
      });

      const datos = await res.json();

      if (!res.ok) {
        setError(datos.detail || 'Error al enviar la calificación.');
        return;
      }

      onSuccess('¡Calificación del paciente enviada exitosamente!');
      onClose();
    } catch {
      setError('Error de conexión al enviar la calificación.');
    } finally {
      setLoading(false);
    }
  };

  const labelEstrella = ['', 'Muy mal comportamiento', 'Mal comportamiento', 'Comportamiento regular', 'Buen paciente', '¡Excelente paciente!'];

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
          <div className="flex justify-between items-center mb-4">
            <h3 className={`${Size.LARGE} font-bold text-gray-800`}>
              Calificar a {appointment.paciente}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <MdClose size={24} />
            </button>
          </div>

          <p className={`${Size.MEDIUM} text-gray-500 mb-5`}>
            Cita del {new Date(appointment.fecha + 'T00:00:00').toLocaleDateString('es-ES')}
          </p>

          {/* Estrellas */}
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setEstrellas(star)}
                className="transition-transform hover:scale-110"
              >
                {star <= (hovered || estrellas) ? (
                  <MdStar size={40} className="text-yellow-400" />
                ) : (
                  <MdStarBorder size={40} className="text-gray-300" />
                )}
              </button>
            ))}
          </div>

          {estrellas > 0 && (
            <p className={`${Size.MEDIUM} text-center text-yellow-500 font-semibold mb-4`}>
              {labelEstrella[estrellas]}
            </p>
          )}

          {/* Comentario */}
          <div className="mb-4">
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>
              Comentario:
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Describe el comportamiento del paciente durante la consulta..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
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
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              <MdSend />
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
