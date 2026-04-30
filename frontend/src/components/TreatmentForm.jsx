import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAdd, MdDelete, MdClose, MdCheckCircle } from 'react-icons/md';
import { Size } from "../styles/styles";

const medicamentoVacio = () => ({
  nombre: '',
  cantidad: '',
  tiempo: '',
  descripcion_dosis: '',
});

export const TreatmentForm = ({ appointment, paciente, onSave, onClose }) => {
  const [diagnostico, setDiagnostico] = useState('');
  const [medicamentos, setMedicamentos] = useState([medicamentoVacio()]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ── Validación ──
  const validate = () => {
    const newErrors = {};

    if (!diagnostico.trim()) {
      newErrors.diagnostico = 'El diagnóstico es obligatorio.';
    }

    medicamentos.forEach((med, idx) => {
      if (!med.nombre.trim())
        newErrors[`med_nombre_${idx}`] = 'Nombre requerido.';
      if (!med.cantidad.trim())
        newErrors[`med_cantidad_${idx}`] = 'Cantidad requerida.';
      if (!med.tiempo.trim())
        newErrors[`med_tiempo_${idx}`] = 'Duración requerida.';
      if (!med.descripcion_dosis.trim())
        newErrors[`med_dosis_${idx}`] = 'Instrucciones requeridas.';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Medicamentos dinámicos ──
  const handleMedChange = (idx, field, value) => {
    setMedicamentos(prev =>
      prev.map((med, i) => (i === idx ? { ...med, [field]: value } : med))
    );
    // Limpia el error del campo al escribir
    const key = `med_${field}_${idx}`;
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const addMedicamento = () => {
    setMedicamentos(prev => [...prev, medicamentoVacio()]);
  };

  const removeMedicamento = (idx) => {
    if (medicamentos.length === 1) return; // mínimo 1
    setMedicamentos(prev => prev.filter((_, i) => i !== idx));
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave({ diagnostico, medicamentos });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className={`${Size.LARGE} font-bold text-gray-800`}>
              Registrar Tratamiento
            </h2>
            <p className={`${Size.MEDIUM} text-gray-500 mt-0.5`}>
              Paciente: <span className="font-semibold text-gray-700">{appointment.paciente}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <MdClose size={26} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Info de la cita */}
          <div className="bg-blue-50 rounded-xl p-4 grid grid-cols-2 gap-4">
            <div>
              <p className={`${Size.MEDIUM} text-blue-600 font-semibold`}>Fecha</p>
              <p className={`${Size.MEDIUM} text-gray-800`}>
                {new Date(appointment.fecha + 'T00:00:00').toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <p className={`${Size.MEDIUM} text-blue-600 font-semibold`}>Hora</p>
              <p className={`${Size.MEDIUM} text-gray-800`}>{appointment.hora}</p>
            </div>
            <div className="col-span-2">
              <p className={`${Size.MEDIUM} text-blue-600 font-semibold`}>Motivo de consulta</p>
              <p className={`${Size.MEDIUM} text-gray-800`}>{appointment.motivo}</p>
            </div>
          </div>

          {/* Diagnóstico */}
          <div>
            <label className={`${Size.MEDIUM} font-semibold text-gray-700 block mb-2`}>
              Diagnóstico <span className="text-red-500">*</span>
            </label>
            <textarea
              value={diagnostico}
              onChange={(e) => {
                setDiagnostico(e.target.value);
                if (errors.diagnostico) setErrors(p => ({ ...p, diagnostico: '' }));
              }}
              placeholder="Ej: Hipertensión arterial, Faringitis aguda, Diabetes tipo 2..."
              rows={3}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 resize-none ${
                errors.diagnostico
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {errors.diagnostico && (
              <p className="text-red-500 text-sm mt-1">{errors.diagnostico}</p>
            )}
          </div>

          {/* Medicamentos */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className={`${Size.MEDIUM} font-semibold text-gray-700`}>
                Medicamentos <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addMedicamento}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-semibold transition"
              >
                <MdAdd size={18} /> Agregar medicamento
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {medicamentos.map((med, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative"
                  >
                    {/* Número + botón eliminar */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {medicamentos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicamento(idx)}
                          className="text-red-400 hover:text-red-600 transition"
                          title="Eliminar medicamento"
                        >
                          <MdDelete size={22} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Nombre */}
                      <div>
                        <label className={`${Size.MEDIUM} text-gray-600 block mb-1`}>
                          Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={med.nombre}
                          onChange={(e) => handleMedChange(idx, 'nombre', e.target.value)}
                          placeholder="Ej: Amoxicilina, Losartán..."
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                            errors[`med_nombre_${idx}`]
                              ? 'border-red-400 focus:ring-red-300'
                              : 'border-gray-300 focus:ring-blue-400'
                          }`}
                        />
                        {errors[`med_nombre_${idx}`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`med_nombre_${idx}`]}</p>
                        )}
                      </div>

                      {/* Cantidad */}
                      <div>
                        <label className={`${Size.MEDIUM} text-gray-600 block mb-1`}>
                          Cantidad <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={med.cantidad}
                          onChange={(e) => handleMedChange(idx, 'cantidad', e.target.value)}
                          placeholder="Ej: 1 caja, 1 frasco, 2 blisters..."
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                            errors[`med_cantidad_${idx}`]
                              ? 'border-red-400 focus:ring-red-300'
                              : 'border-gray-300 focus:ring-blue-400'
                          }`}
                        />
                        {errors[`med_cantidad_${idx}`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`med_cantidad_${idx}`]}</p>
                        )}
                      </div>

                      {/* Tiempo */}
                      <div>
                        <label className={`${Size.MEDIUM} text-gray-600 block mb-1`}>
                          Duración <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={med.tiempo}
                          onChange={(e) => handleMedChange(idx, 'tiempo', e.target.value)}
                          placeholder="Ej: 7 días, 15 días, 1 mes..."
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                            errors[`med_tiempo_${idx}`]
                              ? 'border-red-400 focus:ring-red-300'
                              : 'border-gray-300 focus:ring-blue-400'
                          }`}
                        />
                        {errors[`med_tiempo_${idx}`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`med_tiempo_${idx}`]}</p>
                        )}
                      </div>

                      {/* Descripción de dosis */}
                      <div>
                        <label className={`${Size.MEDIUM} text-gray-600 block mb-1`}>
                          Instrucciones de dosis <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={med.descripcion_dosis}
                          onChange={(e) => handleMedChange(idx, 'descripcion_dosis', e.target.value)}
                          placeholder="Ej: Tomar 1 pastilla cada 8 horas..."
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                            errors[`med_dosis_${idx}`]
                              ? 'border-red-400 focus:ring-red-300'
                              : 'border-gray-300 focus:ring-blue-400'
                          }`}
                        />
                        {errors[`med_dosis_${idx}`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`med_dosis_${idx}`]}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            <MdCheckCircle size={20} />
            {loading ? 'Guardando...' : 'Marcar como Atendido'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
