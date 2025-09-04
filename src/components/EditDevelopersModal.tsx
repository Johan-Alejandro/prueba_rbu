// src/components/developers/EditDeveloperModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import developersApi from "../api/developersapi";

interface Developer {
  codigoDesarrollador: number;
  nombre: string;
  rut: string;
  correoElectronico: string;
  fechaContratacion: string;
  aniosExperiencia: number;
  registroActivo: boolean;
}

interface EditDeveloperModalProps {
  developer: Developer;
  onDeveloperUpdated: (developer: Developer) => void;
}

const EditDevelopersModal = ({
  developer,
  onDeveloperUpdated,
}: EditDeveloperModalProps) => {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(developer.nombre);
  const [rut, setRut] = useState(developer.rut);
  const [correo, setCorreo] = useState(developer.correoElectronico);
  const [fechaContratacion, setFechaContratacion] = useState(
    developer.fechaContratacion.split("T")[0] // Para que el input date funcione
  );
  const [aniosExperiencia, setAniosExperiencia] = useState(
    developer.aniosExperiencia
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedDev = {
        ...developer,
        nombre,
        rut,
        correoElectronico: correo,
        fechaContratacion,
        aniosExperiencia,
      };

      // 🔹 Llamada a API (PUT)
      const saved = await developersApi.update(
        developer.codigoDesarrollador,
        updatedDev
      );

      onDeveloperUpdated(saved); // Avisamos al padre que se actualizó
      setOpen(false);
    } catch (err) {
      console.error("Error actualizando desarrollador:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
          variant="outline"
        >
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Editar Desarrollador</DialogTitle>
          <DialogDescription>
            Modifica la información del desarrollador seleccionado.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="rut">RUT</Label>
            <Input
              id="rut"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="correo">Correo electrónico</Label>
            <Input
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="fecha">Fecha de contratación</Label>
            <Input
              id="fecha"
              type="date"
              value={fechaContratacion}
              onChange={(e) => setFechaContratacion(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="experiencia">Años de experiencia</Label>
            <Input
              id="experiencia"
              type="number"
              min={0}
              value={aniosExperiencia}
              onChange={(e) => setAniosExperiencia(Number(e.target.value))}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Guardar cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDevelopersModal;
