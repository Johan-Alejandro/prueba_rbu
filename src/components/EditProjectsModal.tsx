// src/components/projects/EditProjectsModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";

// Tipo consistente con la API y Projects.tsx
interface Project {
  codigoProyecto: number;
  nombre: string;
  fechaInicio: string;
  fechaTermino?: string;
  desarrolladores: number[]; // IDs de desarrolladores
  registroActivo: boolean;
  desarrolladoresNombres?: string[]; // opcional: nombres para mostrar
}

interface Props {
  project: Project;
  onProjectUpdated: (updatedProject: Project) => void;
}

const EditProjectsModal = ({ project, onProjectUpdated }: Props) => {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(project.nombre);
  const [fechaInicio, setFechaInicio] = useState(project.fechaInicio);
  const [fechaTermino, setFechaTermino] = useState(project.fechaTermino ?? "");
  const [registroActivo, setRegistroActivo] = useState(project.registroActivo);

  const handleSubmit = () => {
    if (!nombre || !fechaInicio) {
      toast.error("Los campos Nombre y Fecha de inicio son obligatorios");
      return;
    }

    const updatedProject: Project = {
      ...project,
      nombre,
      fechaInicio,
      fechaTermino: fechaTermino || undefined,
      registroActivo,
    };

    onProjectUpdated(updatedProject);
    toast.success(`Proyecto "${nombre}" actualizado`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200"
        >
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Editar Proyecto</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          <input
            type="text"
            className="border rounded px-2 py-1 w-full"
            placeholder="Nombre del proyecto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label className="flex flex-col">
            Fecha de inicio:
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </label>

          <label className="flex flex-col">
            Fecha de término:
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={fechaTermino}
              onChange={(e) => setFechaTermino(e.target.value)}
            />
          </label>

          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={registroActivo}
              onChange={() => setRegistroActivo(!registroActivo)}
            />
            Proyecto activo
          </label>

          <Button className="mt-2" onClick={handleSubmit}>
            Guardar cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectsModal;
