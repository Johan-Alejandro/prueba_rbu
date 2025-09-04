// src/components/projects/ProjectsDetailsModal.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";
import projectsApi from "../api/projectsapi";
import developersApi from "../api/developersapi";
import type { Developer } from "../api/developersapi";

interface Project {
  codigoProyecto: number;
  nombre: string;
  fechaInicio: string;
  fechaTermino?: string;
  registroActivo: boolean;
  desarrolladores?: number[]; // IDs de desarrolladores asignados
}

interface Props {
  project: Project;
}

const ProjectsDetailsModal = ({ project }: Props) => {
  const [open, setOpen] = useState(false);
  const [assignedDevelopers, setAssignedDevelopers] = useState<Developer[]>([]);
  const [allDevelopers, setAllDevelopers] = useState<Developer[]>([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState<number | "">("");

  // Traer todos los desarrolladores y los asignados al proyecto
  const fetchDevelopers = async () => {
    try {
      const all = await developersApi.getAll();
      const assignedIds = await projectsApi.getDevelopers(
        project.codigoProyecto
      );

      setAllDevelopers(all);
      const assigned = all.filter((dev) =>
        assignedIds.includes(dev.codigoDesarrollador)
      );
      setAssignedDevelopers(assigned);
    } catch (error) {
      toast.error("Error al cargar desarrolladores");
      console.error(error);
    }
  };

  useEffect(() => {
    if (open) fetchDevelopers();
  }, [open]);

  const handleAssign = async () => {
    if (!selectedDeveloper) return;

    try {
      await projectsApi.assignDeveloper(
        project.codigoProyecto,
        selectedDeveloper
      );
      toast.success("Desarrollador asignado");
      setSelectedDeveloper("");
      fetchDevelopers();
    } catch (error) {
      toast.error("Error al asignar desarrollador");
      console.error(error);
    }
  };

  const handleUnassign = async (developerId: number) => {
    try {
      await projectsApi.unassignDeveloper(project.codigoProyecto, developerId);
      toast.success("Desarrollador desasignado");
      fetchDevelopers();
    } catch (error) {
      toast.error("Error al desasignar desarrollador");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200"
        >
          Ver detalles
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>{project.nombre}</DialogTitle>
          <DialogDescription>
            Información completa del proyecto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Fecha de inicio:</strong>{" "}
            {new Date(project.fechaInicio).toLocaleDateString("es-CL")}
          </p>
          <p>
            <strong>Fecha de término:</strong>{" "}
            {project.fechaTermino
              ? new Date(project.fechaTermino).toLocaleDateString("es-CL")
              : "-"}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            {project.registroActivo ? "Activo" : "Inactivo"}
          </p>

          <div>
            <strong>Desarrolladores asignados:</strong>
            <ul className="list-disc ml-4">
              {assignedDevelopers.length > 0 ? (
                assignedDevelopers.map((dev) => (
                  <li
                    key={dev.codigoDesarrollador}
                    className="flex justify-between items-center"
                  >
                    {dev.nombre}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleUnassign(dev.codigoDesarrollador)}
                    >
                      Quitar
                    </Button>
                  </li>
                ))
              ) : (
                <li>No hay desarrolladores asignados</li>
              )}
            </ul>

            <div className="mt-2 flex gap-2">
              <select
                className="border rounded px-2 py-1 flex-1"
                value={selectedDeveloper}
                onChange={(e) => setSelectedDeveloper(Number(e.target.value))}
              >
                <option value="">Seleccionar desarrollador</option>
                {allDevelopers
                  .filter(
                    (dev) =>
                      !assignedDevelopers.some(
                        (a) => a.codigoDesarrollador === dev.codigoDesarrollador
                      )
                  )
                  .map((dev) => (
                    <option
                      key={dev.codigoDesarrollador}
                      value={dev.codigoDesarrollador}
                    >
                      {dev.nombre}
                    </option>
                  ))}
              </select>
              <Button size="sm" onClick={handleAssign}>
                Asignar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectsDetailsModal;
