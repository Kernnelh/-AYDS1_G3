import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

// Estilos y componentes
import { Size, SizeBox, CButton, Background } from "../styles/styles";
import { Button1 } from "../components/Button1";
import { IconButton } from "../components/IconButton";

// React Icons
import { MdArrowBack, MdLogout, MdEdit, MdVerifiedUser } from "react-icons/md";

export const DashboardMedic = () => {
  const navigate = useNavigate();
  const [medicData, setMedicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener datos del médico del localStorage o de una API
    const fetchMedicData = async () => {
      try {
        // Aquí puedes obtener del localStorage temporalmente
        const storedData = localStorage.getItem('userDataMedic');
        if (storedData) {
          setMedicData(JSON.parse(storedData));
        } else {
          // O hacer una llamada a la API
          // const response = await fetch('/api/medic/profile');
          // const data = await response.json();
          // setMedicData(data);
          throw new Error('No hay datos de médico');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userDataMedic');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className={`${Background.BACKGROUND} flex items-center justify-center h-screen`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className={`${Size.LARGE}`}>Cargando...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${Background.BACKGROUND} min-h-screen py-10`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <IconButton
              id='iconBack'
              icon={<MdArrowBack className="text-gray-700 text-2xl" />}
              style='w-[3vh] h-[3vh] max-w-[30px] max-h-[30px] cursor-pointer hover:bg-gray-200'
              onClick={handleGoBack}
            />
          </div>
          <h1 className={`${Size.EXTRALARGE} text-center flex-1`}>
            Bienvenido Dr./Dra. {medicData?.nombre}
          </h1>
          <IconButton
            id='iconLogout'
            icon={<MdLogout className="text-red-600 text-2xl" />}
            style='w-[3vh] h-[3vh] max-w-[30px] max-h-[30px] cursor-pointer hover:bg-red-100'
            onClick={handleLogout}
          />
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Card de Información Profesional */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 bg-[#FAFAFF] rounded-xl shadow-[0px_0px_50px_10px_rgba(0,0,0,0.1)] p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`${Size.LARGE}`}>Mi Información Profesional</h2>
              <IconButton
                id='iconEdit'
                icon={<MdEdit className="text-blue-600 text-xl" />}
                style='w-[2.5vh] h-[2.5vh] max-w-[25px] max-h-[25px] cursor-pointer hover:bg-blue-100'
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-b-2 border-gray-200 pb-4">
                <p className={`${Size.MEDIUM} text-gray-500`}>Nombre Completo</p>
                <p className={`${Size.LARGE} font-semibold`}>
                  {medicData?.nombre} {medicData?.apellido}
                </p>
              </div>

              <div className="border-b-2 border-gray-200 pb-4">
                <p className={`${Size.MEDIUM} text-gray-500`}>DPI</p>
                <p className={`${Size.LARGE} font-semibold`}>{medicData?.dpi}</p>
              </div>

              <div className="border-b-2 border-gray-200 pb-4">
                <p className={`${Size.MEDIUM} text-gray-500`}>Número Colegiado</p>
                <p className={`${Size.LARGE} font-semibold`}>{medicData?.numero_colegiado}</p>
              </div>

              <div className="border-b-2 border-gray-200 pb-4">
                <p className={`${Size.MEDIUM} text-gray-500`}>Especialidad</p>
                <p className={`${Size.LARGE} font-semibold`}>{medicData?.especialidad}</p>
              </div>

              <div className="border-b-2 border-gray-200 pb-4">
                <p className={`${Size.MEDIUM} text-gray-500`}>Correo Electrónico</p>
                <p className={`${Size.LARGE} font-semibold`}>{medicData?.correo}</p>
              </div>

              <div className="border-b-2 border-gray-200 pb-4">
                <p className={`${Size.MEDIUM} text-gray-500`}>Teléfono</p>
                <p className={`${Size.LARGE} font-semibold`}>{medicData?.telefono}</p>
              </div>

              <div className="border-b-2 border-gray-200 pb-4">
                <p className={`${Size.MEDIUM} text-gray-500`}>Género</p>
                <p className={`${Size.LARGE} font-semibold`}>{medicData?.genero}</p>
              </div>

              <div className="border-b-2 border-gray-200 pb-4">
                <p className={`${Size.MEDIUM} text-gray-500`}>Dirección Clínica</p>
                <p className={`${Size.LARGE} font-semibold`}>{medicData?.direccion_clinica}</p>
              </div>

              <div className="md:col-span-2 border-b-2 border-gray-200 pb-4">
                <p className={`${Size.MEDIUM} text-gray-500`}>Dirección Personal</p>
                <p className={`${Size.LARGE} font-semibold`}>{medicData?.direccion}</p>
              </div>

              <div className="md:col-span-2 border-b-2 border-gray-200 pb-4">
                <p className={`${Size.MEDIUM} text-gray-500`}>Fecha de Nacimiento</p>
                <p className={`${Size.LARGE} font-semibold`}>{medicData?.fecha_nacimiento}</p>
              </div>
            </div>
          </motion.div>

          {/* Card de Foto de perfil */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#FAFAFF] rounded-xl shadow-[0px_0px_50px_10px_rgba(0,0,0,0.1)] p-8 flex flex-col items-center justify-center"
          >
            <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 flex items-center justify-center relative">
              {medicData?.fotografia ? (
                <img
                  src={medicData.fotografia}
                  alt="Perfil"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className={`${Size.LARGE} text-gray-500`}>Sin foto</span>
              )}
              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2">
                <MdVerifiedUser className="text-white text-lg" />
              </div>
            </div>
            <p className={`${Size.MEDIUM} text-center font-semibold`}>
              Dr./Dra. {medicData?.nombre}
            </p>
            <p className={`${Size.SMALL} text-gray-500 text-center mt-2`}>
              {medicData?.especialidad}
            </p>
          </motion.div>
        </div>

        {/* Acciones rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#FAFAFF] rounded-xl shadow-[0px_0px_50px_10px_rgba(0,0,0,0.1)] p-8"
        >
          <h2 className={`${Size.LARGE} mb-6`}>Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button1
              nombre='asdads'
              id='verCitasMed'
              type='button'
              color={CButton.GRADIENT}
              onClick={() => console.log('Ver citas')}
            />
            <Button1
              nombre='Ver Pacientes'
              id='verPacientes'
              type='button'
              color={CButton.MATE}
              onClick={() => console.log('Ver pacientes')}
            />
            <Button1
              nombre='Crear Receta'
              id='crearReceta'
              type='button'
              color={CButton.MATE}
              onClick={() => console.log('Crear receta')}
            />
            <Button1
              nombre='Editar Perfil'
              id='editarPerfilMed'
              type='button'
              color={CButton.MATE}
              onClick={() => console.log('Editar perfil')}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};