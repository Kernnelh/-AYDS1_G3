import { Link } from "react-router-dom";
import { useState } from "react";

// React Icons
import { MdArrowBack, MdFace, MdPhone, MdCardGiftcard, MdPerson, MdLock, MdTextSnippet, MdOutlineFolderSpecial } from "react-icons/md";
import { TbGenderBigender } from "react-icons/tb";
import { FaPhotoVideo } from "react-icons/fa";
import { IoMdMailOpen } from "react-icons/io";

// Estilos y componentes
import { Size, SizeBox, CButton, Background } from "../styles/styles";
import { IconButton } from "../components/IconButton";
import { Input2 } from "../components/Input2";
import { Button1 } from "../components/Button1";

// Logo
import logo2 from "../assets/logo2.png";

export const RegisterMedic = () => {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMensaje("");
    setCargando(true);

    const form = e.target;

    // 1. Si hay foto, primero la subimos
    let urlFoto = null;
    const archivoFoto = form.txtFotografiaM.files[0];

    if (!archivoFoto) {
      setError('La fotografía es obligatoria para el registro de médico');
      setCargando(false);
      return;
    }

    if (!archivoFoto.type.startsWith('image/')) {
      setError('La fotografía debe ser una imagen válida');
      setCargando(false);
      return;
    }

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

    // 2. Subimos el CV (obligatorio)
    const archivoCV = form.txtCvPdf.files[0];

    if (!archivoCV) {
      setError('Debes subir tu Curriculum Vitae en PDF');
      setCargando(false);
      return;
    }

    if (archivoCV.type !== 'application/pdf') {
      setError('El Curriculum Vitae debe ser un PDF');
      setCargando(false);
      return;
    }

    if (archivoCV.size > 2 * 1024 * 1024) {
      setError('El PDF del Curriculum Vitae no debe superar los 2MB');
      setCargando(false);
      return;
    }

    const formDataCV = new FormData();
    formDataCV.append('file', archivoCV);

    const resCV = await fetch('http://127.0.0.1:8000/api/upload/documento', {
      method: 'POST',
      body: formDataCV,
    });

    const datosCV = await resCV.json();
    if (!resCV.ok) {
      setError('Error al subir el Curriculum Vitae');
      setCargando(false);
      return;
    }
    const urlCV = datosCV.url;

    // 3. Registramos al médico
    try {
      const respuesta = await fetch("http://127.0.0.1:8000/api/medicos/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.txtNombreM.value,
          apellido: form.txtApellidoM.value,
          dpi: form.txtDPIM.value,
          genero: form.txtGeneroM.value,
          direccion: form.txtDireccionM.value,
          telefono: form.txtTelefonoM.value,
          fecha_nacimiento: form.txtNacimientoM.value,
          fotografia: urlFoto || "",
          no_colegiado: form.txtColegiadoM.value,
          especialidad: form.txtEspecialidadM.value,
          direccion_clinica: form.txtDireccionClinicaM.value,
          correo: form.txtCorreoM.value,
          contrasena: form.txtPasswordM.value,
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
                    <label className="block text-gray-700 font-semibold mb-1">
                      Fotografía <span className="text-red-500">*</span>
                      <span className="text-gray-400 font-normal ml-2 text-sm">(obligatoria)</span>
                    </label>
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

                {/* CV en PDF */}
                <div className="flex flex-col lg:flex-row gap-x-5">
                  <div className="flex-1">
                    {Input2(
                      "file",
                      "txtCvPdf",
                      "Curriculum Vitae en PDF",
                      <MdTextSnippet className="text-gray-700 text-xl" />,
                      null,
                      {
                        accept: ".pdf,application/pdf",
                        onChange: (e) => {
                          const file = e.target.files[0];
                          if (file && file.size > 2 * 1024 * 1024) {
                            setError('El PDF del CV no debe superar los 2MB');
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
                <Button1
                  nombre={cargando ? 'Registrando...' : 'Crear cuenta Medico'}
                  id='crearCuentaM'
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