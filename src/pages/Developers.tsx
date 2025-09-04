// src/pages/Developers.tsx
import { useEffect, useState } from "react";
import developersApi from "../api/developersapi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import DevelopersModal from "../components/DevelopersModal";
import EditDevelopersModal from "../components/EditDevelopersModal";
import DeveloperDetailsModal from "../components/DevelopersDetailsModal";

// Importa react-hot-toast
import toast, { Toaster } from "react-hot-toast";

interface Developer {
  codigoDesarrollador: number;
  nombre: string;
  rut: string;
  correoElectronico: string;
  fechaContratacion: string;
  aniosExperiencia: number;
  registroActivo: boolean;
}

const Developers = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroEstado, setFiltroEstado] = useState<
    "todos" | "activo" | "inactivo" | ""
  >("");
  const [filtroExperiencia, setFiltroExperiencia] = useState<number | "">("");
  const [filtroNombre, setFiltroNombre] = useState<string>("");

  // Agregar desarrollador
  const handleDeveloperCreated = (newDev: Developer) => {
    const updated = [newDev, ...developers];
    setDevelopers(updated);
    localStorage.setItem("developers", JSON.stringify(updated));
    toast.success(`Desarrollador "${newDev.nombre}" agregado correctamente`);
  };

  // Actualizar desarrollador
  const handleDeveloperUpdated = (updatedDev: Developer) => {
    const updated = developers.map((dev) =>
      dev.codigoDesarrollador === updatedDev.codigoDesarrollador
        ? updatedDev
        : dev
    );
    setDevelopers(updated);
    localStorage.setItem("developers", JSON.stringify(updated));
    toast.success(`Desarrollador "${updatedDev.nombre}" actualizado`);
  };

  // Activar / Desactivar
  const handleToggleActivo = (codigoDesarrollador: number) => {
    const updated = developers.map((dev) =>
      dev.codigoDesarrollador === codigoDesarrollador
        ? { ...dev, registroActivo: !dev.registroActivo }
        : dev
    );
    setDevelopers(updated);
    localStorage.setItem("developers", JSON.stringify(updated));

    const toggledDev = updated.find(
      (dev) => dev.codigoDesarrollador === codigoDesarrollador
    );
    if (toggledDev) {
      const estado = toggledDev.registroActivo ? "activado" : "desactivado";
      toast(`Desarrollador "${toggledDev.nombre}" ${estado}`);
    }
  };

  // Eliminar desarrollador
  const handleDelete = (codigoDesarrollador: number) => {
    const deletedDev = developers.find(
      (dev) => dev.codigoDesarrollador === codigoDesarrollador
    );
    const updated = developers.filter(
      (dev) => dev.codigoDesarrollador !== codigoDesarrollador
    );
    setDevelopers(updated);
    localStorage.setItem("developers", JSON.stringify(updated));

    if (deletedDev) {
      toast.error(`Desarrollador "${deletedDev.nombre}" eliminado`);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("developers");
    if (stored) {
      setDevelopers(JSON.parse(stored));
      setLoading(false);
    } else {
      const fetchDevelopers = async () => {
        try {
          const data = await developersApi.getAll();
          setDevelopers(data);
          localStorage.setItem("developers", JSON.stringify(data));
        } catch (err) {
          setError("No se pudieron cargar los desarrolladores.");
        } finally {
          setLoading(false);
        }
      };
      fetchDevelopers();
    }
  }, []);

  if (loading) return <p className="p-4">Cargando desarrolladores...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  // Filtrado
  const filteredDevelopers = developers.filter((dev) => {
    const estadoMatch =
      filtroEstado === "" ||
      filtroEstado === "todos" ||
      (filtroEstado === "activo" && dev.registroActivo) ||
      (filtroEstado === "inactivo" && !dev.registroActivo);

    const experienciaMatch =
      filtroExperiencia === "" ||
      dev.aniosExperiencia >= Number(filtroExperiencia);

    const nombreMatch =
      filtroNombre === "" ||
      dev.nombre.toLowerCase().includes(filtroNombre.toLowerCase());

    return estadoMatch && experienciaMatch && nombreMatch;
  });

  return (
    <div className="p-4 sm:p-6">
      {/* Toaster */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h1 className="text-lg sm:text-2xl font-bold">
          Desarrolladores Registrados
        </h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre"
            className="border rounded px-2 py-1 w-full sm:w-40"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
          <input
            type="number"
            min={0}
            placeholder="Experiencia mínima"
            className="border rounded px-2 py-1 w-full sm:w-40"
            value={filtroExperiencia}
            onChange={(e) =>
              setFiltroExperiencia(e.target.value ? Number(e.target.value) : "")
            }
          />
          <select
            className="border rounded px-2 py-1 w-full sm:w-40"
            value={filtroEstado}
            onChange={(e) =>
              setFiltroEstado(e.target.value as "todos" | "activo" | "inactivo")
            }
          >
            <option value="">ESTADO</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="todos">Todos</option>
          </select>
          <DevelopersModal onDeveloperCreated={handleDeveloperCreated} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>RUT</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Fecha contratación</TableHead>
              <TableHead>Años experiencia</TableHead>
              <TableHead>Proyectos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevelopers.map((dev) => (
              <TableRow
                key={dev.codigoDesarrollador}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>{dev.nombre}</TableCell>
                <TableCell>{dev.rut}</TableCell>
                <TableCell>{dev.correoElectronico}</TableCell>
                <TableCell>
                  {new Date(dev.fechaContratacion).toLocaleDateString("es-CL")}
                </TableCell>
                <TableCell>{dev.aniosExperiencia}</TableCell>
                <TableCell>0</TableCell>
                <TableCell>
                  {dev.registroActivo ? (
                    <span className="text-green-600 font-medium">Activo</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactivo</span>
                  )}
                </TableCell>
                <TableCell className="flex flex-wrap gap-2">
                  <DeveloperDetailsModal developer={dev} />
                  <EditDevelopersModal
                    developer={dev}
                    onDeveloperUpdated={handleDeveloperUpdated}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className={
                      dev.registroActivo
                        ? "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                        : "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                    }
                    onClick={() => handleToggleActivo(dev.codigoDesarrollador)}
                  >
                    {dev.registroActivo ? "Desactivar" : "Activar"}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleDelete(dev.codigoDesarrollador)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredDevelopers.length === 0 && (
          <p className="p-4 text-gray-600">
            No hay desarrolladores que coincidan con los filtros.
          </p>
        )}
      </div>
    </div>
  );
};

export default Developers;
