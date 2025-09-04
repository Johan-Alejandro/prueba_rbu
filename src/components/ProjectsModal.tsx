// src/components/projects/ProjectsModal.tsx
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

interface Project {
  codigoProyecto: number;
  nombre: string;
  fechaInicio: string;
  fechaTermino: string;
  desarrolladoresAsignados: number;
  registroActivo: boolean;
  desarrolladores?: string[];
}

interface Props {
  onProjectCreated: (newProject: Project) => void;
}

const ProjectsModal = ({ onProjectCreated }: Props) => {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaTermino, setFechaTermino] = useState("");
  const [registroActivo, setRegistroActivo] = useState(true);

  const handleSubmit = () => {
    if (!nombre || !fechaInicio || !fechaTermino) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const newProject: Project = {
      codigoProyecto: Date.now(), // ID temporal, puedes reemplazar con el real de tu API
      nombre,
      fechaInicio,
      fechaTermino,
      desarrolladoresAsignados: 0,
      registroActivo,
      desarrolladores: [],
    };

    onProjectCreated(newProject);
    toast.success(`Proyecto "${nombre}" creado correctamente`);
    setOpen(false);

    // Reset de campos
    setNombre("");
    setFechaInicio("");
    setFechaTermino("");
    setRegistroActivo(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-800 hover:bg-gray-700 text-white">
          Crear Proyecto
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Nuevo Proyecto</DialogTitle>
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
            Crear Proyecto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectsModal;
