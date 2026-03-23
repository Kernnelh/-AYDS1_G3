import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdArrowBack, MdUploadFile } from "react-icons/md";

export const AdminAuth = () => {
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState(null); // Estado para manejar los errores
  const navigate = useNavigate();

  const handleFile = (e) => {
    const file = e.target.files[0];
    setError(null); // Limpiamos errores al seleccionar otro archivo

    if (file && file.type !== "text/plain") {
      setError("Solo se permiten archivos .txt");
      setArchivo(null);
      return;
    }

    setArchivo(file);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!archivo) {
      setError("Debe subir el archivo para continuar");
      return;
    }

    const formData = new FormData();
    formData.append("file", archivo);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/auth2?usuario=admin", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/DashboardAdmin");
      } else {
        // Mostramos el error ("La contraseña del archivo es incorrecta")
        setError(data.detail);
        
        // --- LA SOLUCIÓN AQUÍ ---
        // Vaciamos el estado para obligar al usuario a seleccionar el archivo corregido
        setArchivo(null);
        document.getElementById("fileInput").value = ""; 
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor. Por favor, vuelva a adjuntar el archivo.");
      // Limpiamos también si hay un error de red
      setArchivo(null);
      if (document.getElementById("fileInput")) {
        document.getElementById("fileInput").value = "";
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      {/* Botón regresar */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-black"
      >
        <MdArrowBack className="text-2xl" />
        <span>Volver al Login</span>
      </button>

      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">

        <h2 className="text-2xl font-semibold mb-6">
          Segunda Autenticación
        </h2>

        <p className="text-gray-500 mb-6">
          Suba el archivo de autenticación para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Input oculto */}
          <input
            type="file"
            accept=".txt"
            id="fileInput"
            onChange={handleFile}
            onClick={(e) => { e.target.value = null; }} /* <--- ESTO ES VITAL */
            className="hidden"
          />

          {/* Botón subir archivo */}
          <label
            htmlFor="fileInput"
            className="cursor-pointer flex items-center justify-center gap-2 bg-[#353C43] text-white py-3 rounded-full hover:opacity-90 transition"
          >
            <MdUploadFile className="text-xl" />
            Subir archivo
          </label>

          {/* Nombre del archivo */}
          {archivo && (
            <p className="text-sm text-gray-600 mt-2">
              Archivo seleccionado: <span className="font-medium">{archivo.name}</span>
            </p>
          )}

          {/* Mensaje de error dinámico */}
          {error && (
            <p className="text-red-500 text-sm font-semibold mt-2">{error}</p>
          )}

          {/* Botón validar */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition"
          >
            Validar autenticación
          </button>

        </form>
      </div>
    </div>
  );
};