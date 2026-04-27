import { Link } from "react-router-dom";
import { useState } from "react";

// React Icons
import { MdArrowBack, MdFace, MdPhone, MdCardGiftcard, MdPerson, MdLock, MdTextSnippet } from "react-icons/md";
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

export const RegisterPatient = () => {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMensaje("");
    setCargando(true);

    const form = e.target;

    // Si no hay foto, asigna imagen por defecto
    let urlFoto = 'https://via.placeholder.com/150x150?text=Paciente';
    const archivoFoto = form.txtFotografiaP.files[0];

    if (archivoFoto) {
      const formDataFoto = new FormData();
      formDataFoto.append("file", archivoFoto);

      const resFoto = await fetch("http://127.0.0.1:8000/api/upload/fotografia", {
        method: "POST",
        body: formDataFoto,
      });

      const datosFoto = await resFoto.json();
      if (!resFoto.ok) {
        setError("Error al subir la fotografía");
        setCargando(false);
        return;
      }
      urlFoto = datosFoto.url;
    }

    // 2. Después de subir la foto y antes de registrar al paciente tenemos que subir el PDF del DPI, ya que es obligatorio para el registro:
    const archivoDPI = form.txtDpiPdf.files[0];

    if (!archivoDPI) {
      setError('Debes subir el archivo PDF de tu DPI');
      setCargando(false);
      return;
    }

    if (archivoDPI.type !== 'application/pdf') {
      setError('El archivo del DPI debe ser un PDF');
      setCargando(false);
      return;
    }

    if (archivoDPI.size > 2 * 1024 * 1024) { // 2MB
      setError('El archivo PDF del DPI no debe superar los 2MB');
      setCargando(false);
      return;
    }

    // Subir el PDF al backend
    const formDataDPI = new FormData();
    formDataDPI.append('file', archivoDPI);

    const resDPI = await fetch('http://127.0.0.1:8000/api/upload/documento', {
      method: 'POST',
      body: formDataDPI,
    });

    const datosDPI = await resDPI.json();
    if (!resDPI.ok) {
      setError('Error al subir el archivo PDF del DPI');
      setCargando(false);
      return;
    }
    const urlDPI = datosDPI.url;

    // 3. Registramos al paciente
    try {
      const respuesta = await fetch("http://127.0.0.1:8000/pacientes/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.txtNombreP.value,
          apellido: form.txtApellidoP.value,
          dpi: form.txtDPIP.value,
          genero: form.txtGeneroP.value,
          direccion: form.txtDireccionP.value,
          telefono: form.txtTelefonoP.value,
          fecha_nacimiento: form.txtNacimientoP.value,
          fotografia: urlFoto,
          correo: form.txtCorreoP.value,
          contrasena: form.txtPasswordP.value,
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensaje("¡Cuenta creada con éxito! Espera la aprobación del administrador.");
        form.reset();
      } else {
        setError(datos.detail || "Error al registrar");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
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
            <h1 style={{ fontFamily: "sansation-regular" }} className={`text-center ${Size.EXTRALARGE}`}>Crear cuenta de Pasiente</h1>
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
                    {Input2("text", "txtNombreP", "Nombre", <MdFace className="text-gray-700 text-xl" />)}
                  </div>
                  <div className="flex-1">
                    {Input2("text", "txtApellidoP", "Apellido", <MdFace className="text-gray-700 text-xl" />)}
                  </div>
                </div>

                {/* DPI y Genero */}
                <div className="flex flex-col lg:flex-row gap-x-5">
                  <div className="flex-1">
                    {Input2("text", "txtDPIP", "DPI", <MdTextSnippet className="text-gray-700 text-xl" />)}
                  </div>
                  <div className="flex-1">
                    {Input2("select", "txtGeneroP", "Género", <TbGenderBigender className="text-gray-700 text-xl" />, ["Masculino", "Femenino"])}
                  </div>
                </div>

                {/* Direccion y Telefono */}
                <div className="flex flex-col lg:flex-row gap-x-5">
                  <div className="flex-1">
                    {Input2("text", "txtDireccionP", "Direccion", <MdTextSnippet className="text-gray-700 text-xl" />)}
                  </div>
                  <div className="flex-1">
                    {Input2("number", "txtTelefonoP", "Teléfono", <MdPhone className="text-gray-700 text-xl" />)}
                  </div>
                </div>

                {/* Fecha de nacimiento y Fotografía */}
                <div className="flex flex-col lg:flex-row gap-x-5">
                  <div className="flex-1">
                    {Input2("date", "txtNacimientoP", "Fecha de nacimiento", <MdCardGiftcard className="text-gray-700 text-xl" />)}
                  </div>
                  <div className="flex-1">
                    {Input2("file", "txtFotografiaP", "Fotografía", <FaPhotoVideo className="text-gray-700 text-xl" />)}
                  </div>
                </div>

                {/* DPI en PDF */}
                <div className="flex flex-col lg:flex-row gap-x-5">
                  <div className="flex-1">
                    {Input2(
                      "file",
                      "txtCvPdf",
                      "DPI en PDF",
                      <MdTextSnippet className="text-gray-700 text-xl" />,
                      null,
                      {
                        accept: ".pdf,application/pdf",
                        onChange: (e) => {
                          const file = e.target.files[0];
                          if (file && file.size > 2 * 1024 * 1024) {
                            setError('El PDF del DPI no debe superar los 2MB');
                            e.target.value = '';
                          } else {
                            setError(null);
                          }
                        }
                      }
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      Solo archivos PDF · Peso máximo: 2MB
                    </p>
                  </div>
                </div>

                {/* Correo electronico y Contraseña */}
                <div className="flex flex-col lg:flex-row gap-x-5">
                  <div className="flex-1">
                    {Input2("email", "txtCorreoP", "Correo", <IoMdMailOpen className="text-gray-700 text-xl" />)}
                  </div>
                  <div className="flex-1">
                    {Input2("password", "txtPasswordP", "Contraseña", <MdLock className="text-gray-700 text-xl" />,
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
                <Button1
                  nombre={cargando ? 'Registrando...' : 'Crear cuenta Paciente'}
                  id='crearCuentaP'
                  type='submit'
                  link=''
                  color={CButton.MATE}
                />
              </div>

              {error && (
                <div className="text-red-500 font-semibold text-center mt-2">
                  {error}
                </div>
              )}

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