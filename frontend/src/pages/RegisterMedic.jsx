import { Link } from "react-router-dom";
import { useState } from "react";

// React Icons
import { MdArrowBack, MdFace, MdPhone, MdCardGiftcard, MdPerson, MdLock, MdTextSnippet, MdOutlineFolderSpecial } from "react-icons/md";
import { TbGenderBigender } from "react-icons/tb";
import { FaPhotoVideo } from "react-icons/fa";
import { IoMdMailOpen } from "react-icons/io";

// Estilos y componentes
import { Size, Background, CButton } from "../styles/styles";
import { IconButton } from "../components/IconButton";
import { Input2 } from "../components/Input2";
import { Button1 } from "../components/Button1";

// Logo
import logo2 from "../assets/logo2.png";

export const RegisterMedic = () => {
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const datos = new FormData(e.target);

    console.log(Object.fromEntries(datos));

    setMensaje("Cuenta creada con éxito");
  };

  return (
    <div className={`${Background.BACKGROUNDR} overflow-x-hidden`}>
      <div className="flex justify-center w-full py-8 px-4 md:px-8 lg:px-16">
        <div className="relative flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl w-full max-w-4xl py-8 md:py-10 px-6 md:px-10">

          <div className="absolute top-4 left-4">
            <Link to={'/'}>
              <IconButton
                id='iconBack'
                icon={<MdArrowBack className="text-gray-700 text-2xl" />}
              />
            </Link>
          </div>

          {/* Título y logo */}
          <section className="flex flex-col justify-center items-center mb-12 w-full">
            <h1 style={{ fontFamily: "sansation-regular" }} className={`text-center ${Size.EXTRALARGE}`}>Crear cuenta de Medico</h1>
            <div className="w-3/4 md:w-2/4 mt-4">
              <img src={logo2} alt="Logo" className="w-full h-auto" />
            </div>
          </section>

          {/* Formulario */}
          <section className="flex w-full overflow-auto">
            <form className="flex flex-col w-full" onSubmit={handleSubmit}>
              <div className="space-y-7 w-full">

                {/* Nombre y Apellido */}
                <div className="flex flex-col lg:flex-row gap-x-5">
                  <div className="flex-1">
                    {Input2("text", "txtNombreM", "Nombre", <MdFace className="text-gray-700 text-xl" />)}
                  </div>
                  <div className="flex-1">
                    {Input2("text", "txtApellidoM", "Apellido", <MdFace className="text-gray-700 text-xl" />)}
                  </div>
                </div>

                {/* DPI y Genero */}
                <div className="flex flex-col lg:flex-row gap-x-5">
                  <div className="flex-1">
                    {Input2("text", "txtDPIM", "DPI", <MdTextSnippet className="text-gray-700 text-xl" />)}
                  </div>
                  <div className="flex-1">
                    {Input2("select", "txtGeneroM", "Género", <TbGenderBigender className="text-gray-700 text-xl" />, ["Masculino", "Femenino"])}
                  </div>
                </div>

                {/* Direccion y Telefono */}
                <div className="flex flex-col lg:flex-row gap-x-5">
                  <div className="flex-1">
                    {Input2("text", "txtDireccionM", "Direccion", <MdTextSnippet className="text-gray-700 text-xl" />)}
                  </div>
                  <div className="flex-1">
                    {Input2("number", "txtTelefonoM", "Teléfono", <MdPhone className="text-gray-700 text-xl" />)}
                  </div>
                </div>

                {/* Fecha de nacimiento y Fotografía */}
                <div className="flex flex-col lg:flex-row gap-x-5">
                  <div className="flex-1">
                    {Input2("date", "txtNacimientoM", "Fecha de nacimiento", <MdCardGiftcard className="text-gray-700 text-xl" />)}
                  </div>
                  <div className="flex-1">
                    {Input2("file", "txtFotografiaM", "Fotografía", <FaPhotoVideo className="text-gray-700 text-xl" />)}
                  </div>
                </div>

                {/* Numero de colegiado y especialidad */}
                <div className="flex flex-col lg:flex-row gap-x-5">
                  <div className="flex-1">
                    {Input2("number", "txtColegiadoM", "Numero de colegiado", <MdTextSnippet className="text-gray-700 text-xl" />)}
                  </div>
                  <div className="flex-1">
                    {Input2("text", "txtEspecialidadM", "Especialidad", <MdOutlineFolderSpecial className="text-gray-700 text-xl" />)}
                  </div>
                </div>

                {/* Direccion de su clinica*/}
                <div className="flex flex-col lg:flex-row gap-x-5">
                  <div className="flex-1">
                    {Input2("text", "txtDireccionClinicaM", "Direccion de la clínica", <MdTextSnippet className="text-gray-700 text-xl" />)}
                  </div>
                </div>

                {/* Correo electronico y Contraseña */}
                <div className="flex flex-col lg:flex-row gap-x-5">
                  <div className="flex-1">
                    {Input2("email", "txtCorreoM", "Correo", <IoMdMailOpen className="text-gray-700 text-xl" />)}
                  </div>
                  <div className="flex-1">
                    {Input2("password", "txtPasswordM", "Contraseña", <MdLock className="text-gray-700 text-xl" />,
                      null,
                      {
                        required: true,
                        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$",
                        title: "Debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número"
                      }
                    )}
                  </div>
                </div>

              </div>
              <br></br>
              <br></br>
              <br></br>

              {/* Botón Crear Cuenta */}
              <div className="flex justify-center w-full mb-2">
                <Button1 nombre='Crear cuenta Medico' id='crearCuentaM' type='submit' link='' color={CButton.MATE} />
              </div>
              {mensaje && (
                <div className="text-green-600 font-semibold text-center mt-2">
                  {mensaje}
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};