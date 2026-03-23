import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom"; // Agregamos useNavigate
import { motion } from 'framer-motion';

// Estilos y componentes
import { Size, SizeBox, CButton, Background } from "../styles/Styles";
import { Button1 } from "../components/Button1";
import { Input } from "../components/Input";
import { IconButton } from "../components/IconButton";

// Logo
import logo2 from "../assets/logo2.png";

// React Icons
import { MdArrowBack, MdPerson, MdLock } from "react-icons/md";

const iconTemplate = "bg-[url(assets/backglogin_2.png)]";

export const Login = () => {
  const navigate = useNavigate(); // Hook para navegar entre pantallas
  const [error, setError] = useState(null); // Estado para mostrar errores en pantalla

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiamos errores previos

    // 1. Extraemos los valores usando los IDs que le pasaste a tus componentes Input
    const correo = e.target.txtUserL.value;
    const contrasena = e.target.txtPasswordL.value;

    try {
      // 2. Hacemos la petición a tu API de FastAPI
      const respuesta = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: correo,
          contrasena: contrasena
        })
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // 3. ¡Éxito! Guardamos el token de seguridad
        localStorage.setItem('token', datos.token);
        localStorage.setItem('rol', datos.rol);

        // 4. Redirección inteligente basada en el backend
        if (datos.rol === 'administrador') {
          navigate('/DashboardAdmin');
        } else if (datos.rol === 'medico') {
          navigate('/DashboardMedic');
        } else if (datos.rol === 'paciente') {
          navigate('/DashboardPatient');
        }
      } else {
        // Mostramos el error del backend (ej: "Cuenta pendiente de aprobación")
        setError(datos.detail);
      }
    } catch (error) {
      console.error(error);
      setError('Error de conexión con el servidor. Verifica que FastAPI esté corriendo.');
    }
  };

  return (
    <div className={`${Background.BACKGROUND}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="flex justify-center w-full"
      >
        <div className={`flex bg-[#FAFAFF] rounded-xl shadow-[0px_0px_50px_10px_rgba(0,0,0,0.2)] ${SizeBox.BOX_L}`}>

          {/* Sección izquierda: formulario */}
          <div className="flex flex-col w-full p-5 py-[20px] lg:py-[30px] lg:w-1/2">

            {/* Header: regresar */}
            <section className="w-full flex justify-between px-[12px]">
              <div>
                <IconButton
                  id='iconBack'
                  icon={<MdArrowBack className="text-gray-700 text-2xl" />}
                  style='w-[3vh] h-[3vh] max-w-[30px] max-h-[30px]'
                />
              </div>
            </section>

            {/* Formulario */}
            <section className="flex items-center justify-center w-full">
              <form onSubmit={handleSubmit} className="flex flex-col relative items-center justify-center w-full space-y-8 lg:space-y-12">

                {/* Título y logo */}
                <div className="flex flex-col items-center justify-center">
                  <h2 className={`${Size.EXTRALARGE}`}>Bienvenido a</h2>
                  <img src={logo2} alt="Logo" className="h-[50px] md:h-[60px] lg:h-[4rem] xl:h-[5.5rem] max-w-full" />
                  <p className={`hidden md:flex w-5/6 ${Size.LARGE} mt-5 leading-7 text-center`}>
                    Inicia sesión y empieza a recibir asistencia médica de calidad
                  </p>
                </div>

                {/* Inputs */}
                <section className="flex flex-col items-center justify-center w-full xl:px-[1.5vh] space-y-3">
                  {Input('text', 'txtUserL', 'Usuario o Correo', <MdPerson className="text-gray-700 text-xl" />)}
                  {Input('password', 'txtPasswordL', 'Contraseña', <MdLock className="text-gray-700 text-xl" />)}
                  
                  {/* Mensaje de error dinámico */}
                  {error && (
                    <p className="text-red-500 font-semibold text-center mt-2">{error}</p>
                  )}
                </section>

                {/* Botones */}
                <section className="flex flex-col items-center justify-center w-[90%] md:w-[80%] mt-6 xl:mt-10 space-y-4">
                  
                  {/* Botón único de iniciar sesión */}
                  <div className="flex w-full justify-center">
                     {/* Nota: Asegúrate de que tu componente Button1 soporte type='submit'. 
                         Si no, puedes usar un <button> normal de HTML por ahora */}
                    <button 
                      type="submit" 
                      className={`w-full py-2 rounded text-white font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 transition-opacity`}
                    >
                      Iniciar Sesión
                    </button>
                  </div>

                  {/* Separador */}
                  <div className="w-full flex items-center gap-2 my-2">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <span className="text-gray-500 text-sm">¿No tienes cuenta?</span>
                    <div className="h-px bg-gray-300 flex-1"></div>
                  </div>

                  {/* Botones crear cuenta */}
                  <div className="flex w-full justify-between gap-4">
                    <Button1 nombre='Registrarse como Paciente' id='crearcuentapac' type='link' link='/RegisterPatient' color={CButton.MATE} />
                    <Button1 nombre='Registrarse como Médico' id='crearcuentamed' type='link' link='/RegisterMedic' color={CButton.MATE} />
                  </div>

                </section>
              </form>
            </section>
          </div>

          {/* Sección derecha: imagen de fondo */}
          <div className={`hidden lg:flex flex-col lg:w-1/2 ${iconTemplate} bg-cover bg-center rounded-r-xl xl:py-[30px] xl:px-[20px] text-white items-center justify-center`}>
            <div className="w-full h-full flex flex-col items-center justify-end space-y-3 p-10 my-[5rem] xl:my-[150px]">
              <p className={`${Size.EXTRALARGE2} leading-[80px] font-bold text-center text-black`}>
                ¡Tu salud es nuestra prioridad!
              </p>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};