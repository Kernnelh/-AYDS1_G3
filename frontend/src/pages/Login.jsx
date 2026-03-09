import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

// Estilos y componentes
import { Size, SizeBox, CButton, Background } from "../styles/styles";
import { Button1 } from "../components/Button1";
import { Input } from "../components/Input";
import { IconButton } from "../components/IconButton";
import { CheckBox } from "../components/CheckBox";

// Logo
import logo2 from "../assets/logo2.png";

// React Icons
import { MdArrowBack, MdPerson, MdLock } from "react-icons/md";

const iconTemplate = "bg-[url(assets/backglogin_2.png)]";

export const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
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

            {/* Header: regresar y registrarse */}
            <section className="w-full flex justify-between px-[12px]">
              <div>
                <IconButton
                  id='iconBack'
                  icon={<MdArrowBack className="text-gray-700 text-2xl" />}
                  style='w-[3vh] h-[3vh] max-w-[30px] max-h-[30px]'
                />
              </div>
              {/* Header registrarse sin utilidad ya que esta el boton registrarse abajo*/}
              {/*<div>
                <p className={`${Size.LARGE} hover:text-[#0094FF]`}>
                  <Link to='/Register'>Registrarse</Link>
                </p>
              </div>*/}
            </section>

            {/* Formulario */}
            <section className="flex items-center justify-center w-full">
              <form onSubmit={handleSubmit} className="flex flex-col relative items-center justify-center w-full space-y-8 lg:space-y-16">

                {/* Título y logo */}
                <div className="flex flex-col items-center justify-center">
                  <h2 className={`${Size.EXTRALARGE}`}>Bienvenido a</h2>
                  <img src={logo2} alt="Logo" className="h-[50px] md:h-[60px] lg:h-[4rem] xl:h-[5.5rem] max-w-full" />
                  <p className={`hidden md:flex w-5/6 ${Size.LARGE} mt-5 leading-7`}>
                    Inicia sesión y empieza a recibir asistencia medica de calidad
                  </p>
                </div>

                {/* Inputs */}
                <section className="flex flex-col items-center justify-center w-full xl:px-[1.5vh] space-y-3">
                  {Input('text', 'txtUserL', 'Usuario', <MdPerson className="text-gray-700 text-xl" />)}
                  {Input('password', 'txtPasswordL', 'Contraseña', <MdLock className="text-gray-700 text-xl" />)}

                  {/* Checkbox y olvido de contraseña */}
                  <section className="w-[90%] md:w-[70%] mt-[5px] xl:mt-[10px] flex items-center justify-between">
                    <CheckBox />
                    {/*<div className="items-end text-right">
                      <p className={`flex flex-col ${Size.MEDIUM} hover:text-[#0094FF] mr-3 text-right`}>
                        <a>¿Olvidaste contraseña?</a>
                      </p>
                    </div>*/}
                  </section>
                </section>

                {/* Botones */}
                <section className="flex flex-col items-center justify-center w-[90%] md:w-[72%] mt-10 xl:mt-20 space-y-4">

                  {/* botones crear cuenta */}
                  <div className="flex w-full justify-between gap-4">
                    <Button1 nombre='Registrarse como Paciente' id='crearcuentapac' type='link' link='/RegisterPatient' color={CButton.MATE} />
                    <Button1 nombre='Registrarse como Médico' id='crearcuentamed' type='link' link='/RegisterMedic' color={CButton.MATE} />
                  </div>

                  {/* botón iniciar sesión */}
                  <Button1 nombre='Iniciar sesión' id='iniciarsesion' type='submit' link='' color={CButton.GRADIENT} />

                </section>

              </form>
            </section>
          </div>

          {/* Sección derecha: imagen de fondo */}
          <div className={`hidden lg:flex flex-col lg:w-1/2 ${iconTemplate} bg-cover bg-center rounded-r-xl xl:py-[30px] xl:px-[20px] text-white items-center justify-center`}>
            <div className="w-full h-full flex flex-col items-center justify-end space-y-3 p-10 my-[5rem] xl:my-[150px]">
              <p className={`${Size.EXTRALARGE2} leading-[30px] font-bold text-center text-black`}>
                ¡Tu salud es nuestra prioridad!
              </p>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};