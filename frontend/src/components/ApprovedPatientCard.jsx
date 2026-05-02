import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDelete, MdEdit, MdSave, MdClose } from 'react-icons/md';
import { Size } from "../styles/styles";

const DEFAULT_AVATAR = 'https://via.placeholder.com/200x200?text=Paciente';

export const ApprovedPatientCard = ({ paciente, onDeactivate, onUpdate }) => {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [razonBaja, setRazonBaja] = useState('');
  const [editData, setEditData] = useState(paciente);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const ageDiff = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleDeactivate = async () => {
    if (!razonBaja.trim()) {
      alert('Debes ingresar un motivo');
      return;
    }
    setLoading(true);
    try {
      await onDeactivate(paciente.id_paciente, razonBaja);
      setShowDeactivateModal(false);
      setRazonBaja('');
    } catch (err) {
      alert('Error al dar de baja');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await onUpdate(paciente.id_paciente, editData);
      setShowEditModal(false);
    } catch (err) {
      alert('Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -3 }}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
      >
        {/* Foto */}
        <div className="h-40 bg-gray-200 overflow-hidden flex items-center justify-center border-b-2 border-green-400">
          <img
            src={paciente.fotografia || DEFAULT_AVATAR}
            alt={`${paciente.nombre} ${paciente.apellido}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = DEFAULT_AVATAR;
            }}
          />
        </div>

        {/* Información */}
        <div className="p-5">
          <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-3`}>
            {paciente.nombre} {paciente.apellido}
          </h3>

          {/* Grid de info */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div>
              <p className="text-gray-500 font-semibold uppercase">DPI</p>
              <p className="text-gray-700">{paciente.dpi}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold uppercase">Género</p>
              <p className="text-gray-700">{paciente.genero}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold uppercase">Edad</p>
              <p className="text-gray-700">{calculateAge(paciente.fecha_nacimiento)}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold uppercase">Teléfono</p>
              <p className="text-gray-700">{paciente.telefono}</p>
            </div>
          </div>

          {/* Email */}
          <div className="mb-3 pb-3 border-t pt-3">
            <p className="text-gray-500 font-semibold text-xs uppercase mb-1">Correo</p>
            <p className={`${Size.MEDIUM} text-blue-600 break-words text-sm`}>{paciente.correo}</p>
          </div>

          {/* Fecha registro */}
          <div className="mb-4 text-xs text-gray-500">
            <p>Aprobado: {formatDate(paciente.fecha_registro)}</p>
          </div>

          {/* Botones - ACTUALIZADO */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowEditModal(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 font-semibold py-2 px-3 rounded-lg hover:bg-blue-100 transition border border-blue-200"
            >
              <MdEdit className="text-lg" />
              <span>Editar</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDeactivateModal(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-2 px-3 rounded-lg hover:bg-red-100 transition border border-red-200"
            >
              <MdDelete className="text-lg" />
              <span>Dar de Baja</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal Deactivate */}
      <AnimatePresence>
        {showDeactivateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeactivateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-4`}>
                Dar de Baja a {paciente.nombre}
              </h3>
              <textarea
                value={razonBaja}
                onChange={(e) => setRazonBaja(e.target.value)}
                placeholder="Motivo de la baja..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeactivate}
                  disabled={loading}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold disabled:opacity-60"
                >
                  {loading ? 'Procesando...' : 'Confirmar Baja'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Edit */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`${Size.LARGE} font-bold text-gray-800`}>
                  Editar Paciente
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className={`${Size.MEDIUM} text-gray-700 block mb-1 font-semibold`}>
                    Nombre:
                  </label>
                  <input
                    type="text"
                    value={editData.nombre}
                    onChange={(e) => handleEditChange('nombre', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label className={`${Size.MEDIUM} text-gray-700 block mb-1 font-semibold`}>
                    Apellido:
                  </label>
                  <input
                    type="text"
                    value={editData.apellido}
                    onChange={(e) => handleEditChange('apellido', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Género */}
                <div>
                  <label className={`${Size.MEDIUM} text-gray-700 block mb-1 font-semibold`}>
                    Género:
                  </label>
                  <select
                    value={editData.genero}
                    onChange={(e) => handleEditChange('genero', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                {/* Teléfono */}
                <div>
                  <label className={`${Size.MEDIUM} text-gray-700 block mb-1 font-semibold`}>
                    Teléfono:
                  </label>
                  <input
                    type="text"
                    value={editData.telefono}
                    onChange={(e) => handleEditChange('telefono', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Dirección */}
                <div>
                  <label className={`${Size.MEDIUM} text-gray-700 block mb-1 font-semibold`}>
                    Dirección:
                  </label>
                  <input
                    type="text"
                    value={editData.direccion}
                    onChange={(e) => handleEditChange('direccion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Fecha Nacimiento */}
                <div>
                  <label className={`${Size.MEDIUM} text-gray-700 block mb-1 font-semibold`}>
                    Fecha Nacimiento:
                  </label>
                  <input
                    type="date"
                    value={editData.fecha_nacimiento}
                    onChange={(e) => handleEditChange('fecha_nacimiento', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Email - Read Only */}
                <div>
                  <label className={`${Size.MEDIUM} text-gray-700 block mb-1 font-semibold`}>
                    Correo (No editable):
                  </label>
                  <input
                    type="email"
                    value={editData.correo}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                {/* DPI - Read Only */}
                <div>
                  <label className={`${Size.MEDIUM} text-gray-700 block mb-1 font-semibold`}>
                    DPI (No editable):
                  </label>
                  <input
                    type="text"
                    value={editData.dpi}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <MdSave />
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};