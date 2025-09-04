import { ENDPOINTS } from "./endpoints";

const API_BASE = import.meta.env.VITE_API_BASE;
const TOKEN = import.meta.env.VITE_API_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

export interface Developer {
  codigoDesarrollador: number;
  nombre: string;
  rut: string;
  correoElectronico: string;
  fechaContratacion: string;
  aniosExperiencia: number;
  registroActivo: boolean;
}

const developersApi = {
  getAll: async (): Promise<Developer[]> => {
    const res = await fetch(`${API_BASE}${ENDPOINTS.DEVELOPERS}`, { headers });
    console.log("API response (getAll):", res); // <-- Aquí
    if (!res.ok) throw new Error("Error al obtener desarrolladores");
    return res.json();
  },

  getById: async (id: number): Promise<Developer> => {
    const res = await fetch(`${API_BASE}${ENDPOINTS.DEVELOPER_BY_ID(id)}`, {
      headers,
    });
    if (!res.ok) throw new Error("Error al obtener desarrollador");
    return res.json();
  },

  create: async (
    data: Omit<Developer, "codigoDesarrollador" | "registroActivo">
  ): Promise<Developer> => {
    const res = await fetch(`${API_BASE}${ENDPOINTS.DEVELOPERS}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear desarrollador");
    return res.json();
  },

  update: async (
    id: number,
    data: Partial<Omit<Developer, "codigoDesarrollador" | "registroActivo">>
  ): Promise<Developer> => {
    const res = await fetch(`${API_BASE}${ENDPOINTS.DEVELOPER_BY_ID(id)}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar desarrollador");
    return res.json();
  },

  delete: async (id: number): Promise<Developer> => {
    const res = await fetch(`${API_BASE}${ENDPOINTS.DEVELOPER_BY_ID(id)}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error("Error al eliminar desarrollador");
    return res.json();
  },

  reactivate: async (id: number): Promise<Developer> => {
    const res = await fetch(
      `${API_BASE}${ENDPOINTS.DEVELOPER_REACTIVATE(id)}`,
      {
        method: "PUT",
        headers,
      }
    );
    if (!res.ok) throw new Error("Error al reactivar desarrollador");
    return res.json();
  },

  getProjects: async (id: number) => {
    const res = await fetch(`${API_BASE}${ENDPOINTS.DEVELOPER_PROJECTS(id)}`, {
      headers,
    });
    if (!res.ok)
      throw new Error("Error al obtener proyectos del desarrollador");
    return res.json();
  },
};

export default developersApi;
