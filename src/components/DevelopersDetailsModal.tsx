// src/components/developers/DeveloperDetailsModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

interface Developer {
  codigoDesarrollador: number;
  nombre: string;
  rut: string;
  correoElectronico: string;
  fechaContratacion: string;
  aniosExperiencia: number;
  registroActivo: boolean;
  proyectos?: string[]; // ⚡ cuando conectemos con API, traer proyectos aquí
}

interface Props {
  developer: Developer;
}

const DeveloperDetailsModal = ({ developer }: Props) => {
  const [open, setOpen] = useState(false);

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
          <DialogTitle>{developer.nombre}</DialogTitle>
          <DialogDescription>
            Información completa del desarrollador
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <p>
            <strong>RUT:</strong> {developer.rut}
          </p>
          <p>
            <strong>Correo:</strong> {developer.correoElectronico}
          </p>
          <p>
            <strong>Fecha de contratación:</strong>{" "}
            {new Date(developer.fechaContratacion).toLocaleDateString("es-CL")}
          </p>
          <p>
            <strong>Años experiencia:</strong> {developer.aniosExperiencia}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            {developer.registroActivo ? "Activo" : "Inactivo"}
          </p>
          <div>
            <strong>Proyectos asignados:</strong>
            <ul className="list-disc ml-4">
              {developer.proyectos && developer.proyectos.length > 0 ? (
                developer.proyectos.map((p, i) => <li key={i}>{p}</li>)
              ) : (
                <li>No tiene proyectos asignados</li>
              )}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeveloperDetailsModal;
