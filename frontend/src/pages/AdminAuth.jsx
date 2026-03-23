import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdArrowBack, MdUploadFile } from "react-icons/md";

export const AdminAuth = () => {
  const [archivo, setArchivo] = useState(null);
  const navigate = useNavigate();

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (file && file.type !== "text/plain") {
      alert("Solo se permiten archivos .txt");
      return;
    }

    setArchivo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!archivo) {
      alert("Debe subir el archivo");
      return;
    }

    const texto = await archivo.text();

    // Simulación validación (luego va backend)
    if (texto.trim() === "CLAVE_ENCRIPTADA_123") {
      navigate("/DashboardAdmin");
    } else {
      alert("Archivo inválido");
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
        <span>Volver</span>
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