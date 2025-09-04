// src/pages/Projects.tsx
import { useEffect, useState } from "react";
import projectsApi from "../api/projectsapi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import ProjectsModal from "../components/ProjectsModal";
import EditProjectsModal from "../components/EditProjectsModal";
import ProjectsDetailsModal from "../components/ProjectsDetailsModal";
import toast, { Toaster } from "react-hot-toast";

// Tipo local para proyectos, consistente con la API
interface Project {
  codigoProyecto: number;
  nombre: string;
  fechaInicio: string;
  fechaTermino?: string;
  registroActivo: boolean;
  desarrolladores: number[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroEstado, setFiltroEstado] = useState<
    "todos" | "activo" | "inactivo" | ""
  >("");
  const [filtroNombre, setFiltroNombre] = useState<string>("");

  // Normaliza un proyecto de la API a nuestro tipo local
  const normalizeProject = (p: any): Project => ({
    ...p,
    desarrolladores: (p.desarrolladores || []).map(Number),
  });

  // Crear proyecto
  const handleProjectCreated = (newProject: any) => {
    const normalized = normalizeProject(newProject);
    const updated = [normalized, ...projects];
    setProjects(updated);
    toast.success(`Proyecto "${normalized.nombre}" creado correctamente`);
  };

  // Editar proyecto
  const handleProjectUpdated = (updatedProject: any) => {
    const normalized = normalizeProject(updatedProject);
    const updated = projects.map((proj) =>
      proj.codigoProyecto === normalized.codigoProyecto ? normalized : proj
    );
    setProjects(updated);
    toast.success(`Proyecto "${normalized.nombre}" actualizado`);
  };

  // Activar / Desactivar (soft delete)
  const handleToggleActivo = (codigoProyecto: number) => {
    const updated = projects.map((proj) =>
      proj.codigoProyecto === codigoProyecto
        ? { ...proj, registroActivo: !proj.registroActivo }
        : proj
    );
    setProjects(updated);

    const toggled = updated.find((p) => p.codigoProyecto === codigoProyecto);
    if (toggled) {
      const estado = toggled.registroActivo ? "activado" : "desactivado";
      toast(`Proyecto "${toggled.nombre}" ${estado}`);
    }
  };

  // Eliminar proyecto
  const handleDelete = (codigoProyecto: number) => {
    const deleted = projects.find(
      (proj) => proj.codigoProyecto === codigoProyecto
    );
    const updated = projects.filter(
      (proj) => proj.codigoProyecto !== codigoProyecto
    );
    setProjects(updated);

    if (deleted) {
      toast.error(`Proyecto "${deleted.nombre}" eliminado`);
    }
  };

  // Cargar proyectos desde la API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsApi.getAll();
        console.log("Proyectos desde API:", data);
        const normalized: Project[] = data.map(normalizeProject);
        setProjects(normalized);
      } catch {
        setError("No se pudieron cargar los proyectos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="p-4">Cargando proyectos...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  // Filtrado
  const filteredProjects = projects.filter((proj) => {
    const estadoMatch =
      filtroEstado === "" ||
      filtroEstado === "todos" ||
      (filtroEstado === "activo" && proj.registroActivo) ||
      (filtroEstado === "inactivo" && !proj.registroActivo);

    const nombreMatch =
      filtroNombre === "" ||
      proj.nombre.toLowerCase().includes(filtroNombre.toLowerCase());

    return estadoMatch && nombreMatch;
  });

  return (
    <div className="p-4 sm:p-6">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h1 className="text-lg sm:text-2xl font-bold">Gestión de Proyectos</h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre"
            className="border rounded px-2 py-1 w-full sm:w-40"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
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

          <ProjectsModal onProjectCreated={handleProjectCreated} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha inicio</TableHead>
              <TableHead>Fecha término</TableHead>
              <TableHead>Desarrolladores</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((proj) => (
              <TableRow
                key={proj.codigoProyecto}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>{proj.nombre}</TableCell>
                <TableCell>
                  {new Date(proj.fechaInicio).toLocaleDateString("es-CL")}
                </TableCell>
                <TableCell>
                  {proj.fechaTermino
                    ? new Date(proj.fechaTermino).toLocaleDateString("es-CL")
                    : "-"}
                </TableCell>
                <TableCell>{proj.desarrolladores.length}</TableCell>
                <TableCell>
                  {proj.registroActivo ? (
                    <span className="text-green-600 font-medium">Activo</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactivo</span>
                  )}
                </TableCell>
                <TableCell className="flex flex-wrap gap-2">
                  <ProjectsDetailsModal project={proj} />
                  <EditProjectsModal
                    project={proj}
                    onProjectUpdated={handleProjectUpdated}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className={
                      proj.registroActivo
                        ? "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                        : "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                    }
                    onClick={() => handleToggleActivo(proj.codigoProyecto)}
                  >
                    {proj.registroActivo ? "Desactivar" : "Reactivar"}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleDelete(proj.codigoProyecto)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredProjects.length === 0 && (
          <p className="p-4 text-gray-600">
            No hay proyectos que coincidan con los filtros.
          </p>
        )}
      </div>
    </div>
  );
};

export default Projects;
