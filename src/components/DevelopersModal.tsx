// src/components/developers/AddDeveloperModal.tsx
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

// Define props para poder actualizar la tabla desde la página principal
interface AddDeveloperModalProps {
  onDeveloperCreated: (developer: any) => void;
}

const DevelopersModal = ({ onDeveloperCreated }: AddDeveloperModalProps) => {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [correo, setCorreo] = useState("");
  const [fechaContratacion, setFechaContratacion] = useState("");
  const [aniosExperiencia, setAniosExperiencia] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Convierte "YYYY-MM-DD" -> "YYYY-MM-DDT00:00:00" (formato que pide tu API)
  const toApiDateTime = (d: string) => (d ? `${d}T00:00:00` : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaving(true);
    try {
      // Validaciones mínimas según doc (opcional)
      if (nombre.length > 200)
        throw new Error("El nombre excede 200 caracteres");
      if (rut.length > 10) throw new Error("El RUT excede 10 caracteres");
      if (correo.length > 100)
        throw new Error("El correo excede 100 caracteres");

      const payload = {
        nombre,
        rut,
        correoElectronico: correo,
        fechaContratacion: toApiDateTime(fechaContratacion),
        aniosExperiencia,
      };

      const created = await developersApi.create(payload);
      onDeveloperCreated(created);
      setOpen(false);
      setNombre("");
      setRut("");
      setCorreo("");
      setFechaContratacion("");
      setAniosExperiencia(0);
    } catch (err: any) {
      console.error("Error creando desarrollador:", err);
      setErrorMsg(err?.message ?? "No se pudo crear el desarrollador");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-800 hover:bg-gray-700 text-white">
          + Desarrollador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Agregar Desarrollador</DialogTitle>
          <DialogDescription>
            Completa los datos para registrar un nuevo desarrollador.
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
          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DevelopersModal;
