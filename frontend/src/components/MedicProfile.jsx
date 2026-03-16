import { useState } from 'react';
import { motion } from 'framer-motion';
import { Size } from "../styles/Styles";

export const MedicProfile = ({ medico, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(medico);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';
    if (!formData.direccion_clinica.trim()) newErrors.direccion_clinica = 'La dirección de clínica es requerida';
    if (!formData.especialidad.trim()) newErrors.especialidad = 'La especialidad es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onUpdate(formData);
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleCancel = () => {
    setFormData(medico);
    setErrors({});
    setIsEditing(false);
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-green-50 border-l-4 border-green-500 rounded"
        >
          <p className={`${Size.MEDIUM} text-green-700`}>✓ Perfil actualizado exitosamente</p>
        </motion.div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`${Size.LARGE} font-bold text-gray-800`}>Mi Perfil</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold"
            >
              ✎ Editar
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Nombre:</label>
            {isEditing ? (
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            ) : (
              <p className={`${Size.MEDIUM} text-gray-600`}>{formData.nombre}</p>
            )}
            {errors.nombre && <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>}
          </div>

          {/* Apellido */}
          <div>
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Apellido:</label>
            {isEditing ? (
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.apellido ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            ) : (
              <p className={`${Size.MEDIUM} text-gray-600`}>{formData.apellido}</p>
            )}
            {errors.apellido && <p className="text-red-600 text-sm mt-1">{errors.apellido}</p>}
          </div>

          {/* DPI */}
          <div>
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>DPI (No editable):</label>
            <p className={`${Size.MEDIUM} text-gray-600 bg-gray-100 px-4 py-2 rounded`}>{formData.dpi}</p>
          </div>

          {/* Género */}
          <div>
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Género:</label>
            {isEditing ? (
              <select
                name="genero"
                value={formData.genero}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            ) : (
              <p className={`${Size.MEDIUM} text-gray-600`}>{formData.genero}</p>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Fecha de Nacimiento:</label>
            {isEditing ? (
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className={`${Size.MEDIUM} text-gray-600`}>
                {new Date(formData.fecha_nacimiento).toLocaleDateString('es-ES')}
                <span className="ml-2 text-gray-500">({calculateAge(formData.fecha_nacimiento)} años)</span>
              </p>
            )}
          </div>

          {/* Especialidad */}
          <div>
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Especialidad:</label>
            {isEditing ? (
              <input
                type="text"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.especialidad ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            ) : (
              <p className={`${Size.MEDIUM} text-gray-600`}>{formData.especialidad}</p>
            )}
            {errors.especialidad && <p className="text-red-600 text-sm mt-1">{errors.especialidad}</p>}
          </div>

          {/* No. Colegiado */}
          <div>
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>No. Colegiado (No editable):</label>
            <p className={`${Size.MEDIUM} text-gray-600 bg-gray-100 px-4 py-2 rounded`}>{formData.no_colegiado}</p>
          </div>

          {/* Correo */}
          <div>
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Correo (No editable):</label>
            <p className={`${Size.MEDIUM} text-gray-600 bg-gray-100 px-4 py-2 rounded`}>{formData.correo}</p>
          </div>

          {/* Teléfono */}
          <div>
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Teléfono:</label>
            {isEditing ? (
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.telefono ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            ) : (
              <p className={`${Size.MEDIUM} text-gray-600`}>{formData.telefono}</p>
            )}
            {errors.telefono && <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>}
          </div>

          {/* Dirección */}
          <div className="md:col-span-2">
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Dirección:</label>
            {isEditing ? (
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.direccion ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            ) : (
              <p className={`${Size.MEDIUM} text-gray-600`}>{formData.direccion}</p>
            )}
            {errors.direccion && <p className="text-red-600 text-sm mt-1">{errors.direccion}</p>}
          </div>

          {/* Dirección Clínica */}
          <div className="md:col-span-2">
            <label className={`${Size.MEDIUM} text-gray-700 block mb-2`}>Dirección de la Clínica:</label>
            {isEditing ? (
              <input
                type="text"
                name="direccion_clinica"
                value={formData.direccion_clinica}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.direccion_clinica ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            ) : (
              <p className={`${Size.MEDIUM} text-gray-600`}>{formData.direccion_clinica}</p>
            )}
            {errors.direccion_clinica && <p className="text-red-600 text-sm mt-1">{errors.direccion_clinica}</p>}
          </div>
        </div>

        {/* Botones de acción */}
        {isEditing && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-semibold"
            >
              ✓ Guardar Cambios
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 font-semibold"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};