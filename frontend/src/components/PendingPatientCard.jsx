import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckCircle, MdCancel, MdClose, MdDescription } from 'react-icons/md';
import { Size } from "../styles/styles";

const DEFAULT_AVATAR = 'https://via.placeholder.com/200x200?text=Paciente';

export const PendingPatientCard = ({ paciente, onApprove, onReject }) => {
  const [showPdfModal, setShowPdfModal] = useState(false);

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

  const handleDownloadPDF = () => {
    if (paciente.dpi_pdf_url) {
      const link = document.createElement('a');
      link.href = paciente.dpi_pdf_url;
      link.download = `DPI_${paciente.id_paciente}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition w-full max-w-sm"
      >
        {/* Sección superior: Fotografía */}
        <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center border-b-4 border-blue-400">
          <img
            src={paciente.fotografia || DEFAULT_AVATAR}
            alt={`${paciente.nombre} ${paciente.apellido}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = DEFAULT_AVATAR;
            }}
          />
        </div>

        {/* Información del paciente */}
        <div className="p-6">
          {/* Nombre */}
          <h3 className={`${Size.LARGE} font-bold text-gray-800 mb-3`}>
            {paciente.nombre} {paciente.apellido}
          </h3>

          {/* Información en dos columnas */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide">DPI</p>
              <p className="text-gray-700 font-semibold">{paciente.dpi}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Género</p>
              <p className="text-gray-700 font-semibold">{paciente.genero}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Edad</p>
              <p className="text-gray-700 font-semibold">{calculateAge(paciente.fecha_nacimiento)} años</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide">Nac.</p>
              <p className="text-gray-700 font-semibold text-xs">{formatDate(paciente.fecha_nacimiento)}</p>
            </div>
          </div>

          {/* Email */}
          <div className="mb-4 pb-4 border-t pt-4">
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-1">Correo Electrónico</p>
            <p className={`${Size.MEDIUM} text-blue-600 break-words`}>{paciente.correo}</p>
          </div>

          {/* Fecha de Registro */}
          <div className="mb-6 text-xs text-gray-500">
            <p>Solicitud recibida: {formatDate(paciente.fecha_registro)}</p>
          </div>

          {/* Botón Ver DPI - NUEVO */}
          {paciente.dpi_pdf_url && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPdfModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-amber-50 text-amber-600 font-semibold py-2 px-3 rounded-lg hover:bg-amber-100 transition border border-amber-200 mb-3"
            >
              <MdDescription className="text-lg" />
              <span>Ver DPI Escaneado</span>
            </motion.button>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-3 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onApprove(paciente.id_paciente)}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#0094FF] to-[#00E0FF] text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition"
            >
              <MdCheckCircle className="text-lg" />
              <span>Aceptar</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onReject(paciente.id_paciente)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 hover:shadow-lg transition"
            >
              <MdCancel className="text-lg" />
              <span>Rechazar</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal PDF - NUEVO */}
      <AnimatePresence>
        {showPdfModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPdfModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[600px] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className={`${Size.LARGE} font-bold text-gray-800`}>
                  DPI Escaneado - {paciente.nombre} {paciente.apellido}
                </h3>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <MdClose size={24} />
                </button>
              </div>

              {/* PDF Viewer */}
              <div className="flex-1 overflow-auto">
                <iframe
                  src={paciente.dpi_pdf_url}
                  className="w-full h-full"
                  title="DPI PDF"
                />
              </div>

              {/* Footer Modal */}
              <div className="flex gap-3 p-4 border-t">
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition"
                >
                  ⬇ Descargar PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};