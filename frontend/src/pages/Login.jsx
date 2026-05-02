import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Size, SizeBox, CButton, Background } from "../styles/Styles";
import { Button1 } from "../components/Button1";
import { Input } from "../components/Input";
import { IconButton } from "../components/IconButton";

import logo2 from "../assets/logo2.png";

import { MdArrowBack, MdPerson, MdLock, MdVpnKey } from "react-icons/md";

const iconTemplate = "bg-[url(assets/backglogin_2.png)]";

export const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [primerIngreso, setPrimerIngreso] = useState(false); // controla si mostrar el campo token
  const [datosLogin, setDatosLogin] = useState({ correo: '', contrasena: '' }); // guarda correo y pass para el segundo paso

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const correo = e.target.txtUserL.value;
    const contrasena = e.target.txtPasswordL.value;

  /* 
    // ======= SIMULACIÓN TEMPORAL - BORRAR CUANDO EL BACKEND ESTÉ LISTO =======
    // Simula que juanO@email.com es primer ingreso
    if (correo === 'juanO@email.com' && contrasena === 'Ad123456') {
      setDatosLogin({ correo, contrasena });
      setPrimerIngreso(true);
      return;
    }
    // ======= FIN SIMULACIÓN =======
 */
    try {
      const respuesta = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        if (datos.primer_ingreso) {
          // Guardamos correo y contraseña para usarlos en el segundo paso
          setDatosLogin({ correo, contrasena });
          setPrimerIngreso(true); // mostramos el campo de token
          return;
        }

        // Login normal (no es primer ingreso)
        localStorage.setItem('token', datos.token);
        localStorage.setItem('rol', datos.rol);

        if (datos.rol === 'administrador') navigate('/AdminAuth');
        else if (datos.rol === 'medico') navigate('/DashboardMedic');
        else if (datos.rol === 'paciente') navigate('/DashboardPatient');

      } else {
        setError(datos.detail);
      }
    } catch (error) {
      setError('Error de conexión con el servidor.');
    }
  };

  const handleVerificarToken = async (e) => {
    e.preventDefault();
    setError(null);

    const tokenVerificacion = e.target.txtToken.value.trim();

   /* // ======= SIMULACIÓN TEMPORAL - BORRAR CUANDO EL BACKEND ESTÉ LISTO =======
    if (tokenVerificacion === 'TOKEN123') {
      localStorage.setItem('token', 'fake-token-para-pruebas');
      localStorage.setItem('rol', 'paciente');
      navigate('/DashboardPatient');
      return;
    } else {
      setError('Token de verificación incorrecto');
      return;
    }
    // ======= FIN SIMULACIÓN =======
*/
    try {
      const respuesta = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: datosLogin.correo,
          contrasena: datosLogin.contrasena,
          token_verificacion: tokenVerificacion
        })
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        localStorage.setItem('token', datos.token);
        localStorage.setItem('rol', datos.rol);

        if (datos.rol === 'administrador') navigate('/AdminAuth');
        else if (datos.rol === 'medico') navigate('/DashboardMedic');
        else if (datos.rol === 'paciente') navigate('/DashboardPatient');
      } else {
        setError(datos.detail);
      }
    } catch (error) {
      setError('Error de conexión con el servidor.');
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

          {/* Sección izquierda */}
          <div className="flex flex-col w-full p-5 py-[20px] lg:py-[30px] lg:w-1/2">

            <section className="w-full flex justify-between px-[12px]">
              <div>
                <IconButton
                  id='iconBack'
                  icon={<MdArrowBack className="text-gray-700 text-2xl" />}
                  style='w-[3vh] h-[3vh] max-w-[30px] max-h-[30px]'
                />
              </div>
            </section>

            <section className="flex items-center justify-center w-full">

              {/* PASO 1: Login normal */}
              {!primerIngreso && (
                <form onSubmit={handleSubmit} className="flex flex-col relative items-center justify-center w-full space-y-8 lg:space-y-12">
                  <div className="flex flex-col items-center justify-center">
                    <h2 className={`${Size.EXTRALARGE}`}>Bienvenido a</h2>
                    <img src={logo2} alt="Logo" className="h-[50px] md:h-[60px] lg:h-[4rem] xl:h-[5.5rem] max-w-full" />
                    <p className={`hidden md:flex w-5/6 ${Size.LARGE} mt-5 leading-7 text-center`}>
                      Inicia sesión y empieza a recibir asistencia médica de calidad
                    </p>
                  </div>

                  <section className="flex flex-col items-center justify-center w-full xl:px-[1.5vh] space-y-3">
                    {Input('text', 'txtUserL', 'Usuario o Correo', <MdPerson className="text-gray-700 text-xl" />)}
                    {Input('password', 'txtPasswordL', 'Contraseña', <MdLock className="text-gray-700 text-xl" />)}
                    {error && <p className="text-red-500 font-semibold text-center mt-2">{error}</p>}
                  </section>

                  <section className="flex flex-col items-center justify-center w-[90%] md:w-[80%] mt-6 xl:mt-10 space-y-4">
                    <div className="flex w-full justify-center">
                      <button
                        type="submit"
                        className="w-full py-2 rounded text-white font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 transition-opacity"
                      >
                        Iniciar Sesión
                      </button>
                    </div>

                    <div className="w-full flex items-center gap-2 my-2">
                      <div className="h-px bg-gray-300 flex-1"></div>
                      <span className="text-gray-500 text-sm">¿No tienes cuenta?</span>
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>

                    <div className="flex w-full justify-between gap-4">
                      <Button1 nombre='Registrarse como Paciente' id='crearcuentapac' type='link' link='/RegisterPatient' color={CButton.MATE} />
                      <Button1 nombre='Registrarse como Médico' id='crearcuentamed' type='link' link='/RegisterMedic' color={CButton.MATE} />
                    </div>
                  </section>
                </form>
              )}

              {/* PASO 2: Verificar token de correo (solo primer ingreso) */}
              {primerIngreso && (
                <form onSubmit={handleVerificarToken} className="flex flex-col relative items-center justify-center w-full space-y-8 lg:space-y-12">
                  <div className="flex flex-col items-center justify-center">
                    <h2 className={`${Size.EXTRALARGE}`}>Verificar Correo</h2>
                    <img src={logo2} alt="Logo" className="h-[50px] md:h-[60px] lg:h-[4rem] xl:h-[5.5rem] max-w-full" />
                    <p className={`hidden md:flex w-5/6 ${Size.LARGE} mt-5 leading-7 text-center`}>
                      Revisa tu correo electrónico e ingresa el token de verificación que te enviamos
                    </p>
                  </div>

                  <section className="flex flex-col items-center justify-center w-full xl:px-[1.5vh] space-y-3">
                    {Input('text', 'txtToken', 'Token de verificación', <MdVpnKey className="text-gray-700 text-xl" />)}
                    {error && <p className="text-red-500 font-semibold text-center mt-2">{error}</p>}
                  </section>

                  <section className="flex flex-col items-center justify-center w-[90%] md:w-[80%] mt-6 xl:mt-10 space-y-4">
                    <div className="flex w-full justify-center">
                      <button
                        type="submit"
                        className="w-full py-2 rounded text-white font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 transition-opacity"
                      >
                        Verificar Token
                      </button>
                    </div>

                    {/* Opción para volver al login normal */}
                    <button
                      type="button"
                      onClick={() => { setPrimerIngreso(false); setError(null); }}
                      className="text-gray-500 text-sm hover:text-gray-700 underline"
                    >
                      ← Volver al inicio de sesión
                    </button>
                  </section>
                </form>
              )}

            </section>
          </div>

          {/* Sección derecha: imagen */}
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