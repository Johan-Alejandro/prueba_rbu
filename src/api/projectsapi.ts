import { ENDPOINTS } from "./endpoints";

const API_BASE = import.meta.env.VITE_API_BASE;
const TOKEN = import.meta.env.VITE_API_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

export interface Project {
  codigoProyecto: number;
  nombre: string;
  fechaInicio: string;
  fechaTermino?: string;
  registroActivo: boolean;
  desarrolladores?: number[]; // opcional si quieres almacenar IDs de desarrolladores
}

const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const res = await fetch(`${API_BASE}${ENDPOINTS.PROJECTS}`, { headers });
    if (!res.ok) throw new Error("Error al obtener proyectos");
    return res.json();
  },

  getById: async (id: number): Promise<Project> => {
    const res = await fetch(`${API_BASE}${ENDPOINTS.PROJECT_BY_ID(id)}`, {
      headers,
    });
    if (!res.ok) throw new Error("Error al obtener proyecto");
    return res.json();
  },

  create: async (
    data: Omit<Project, "codigoProyecto" | "registroActivo">
  ): Promise<Project> => {
    const res = await fetch(`${API_BASE}${ENDPOINTS.PROJECTS}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear proyecto");
    return res.json();
  },

  update: async (
    id: number,
    data: Partial<Omit<Project, "codigoProyecto" | "registroActivo">>
  ): Promise<Project> => {
    const res = await fetch(`${API_BASE}${ENDPOINTS.PROJECT_BY_ID(id)}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar proyecto");
    return res.json();
  },

  delete: async (id: number): Promise<Project> => {
    const res = await fetch(`${API_BASE}${ENDPOINTS.PROJECT_BY_ID(id)}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error("Error al eliminar proyecto");
    return res.json();
  },

  reactivate: async (id: number): Promise<Project> => {
    const res = await fetch(`${API_BASE}${ENDPOINTS.PROJECT_REACTIVATE(id)}`, {
      method: "PUT",
      headers,
    });
    if (!res.ok) throw new Error("Error al reactivar proyecto");
    return res.json();
  },

  assignDeveloper: async (
    projectId: number,
    developerId: number
  ): Promise<void> => {
    const url = `${API_BASE}${ENDPOINTS.ASSIGN_DEVELOPER_TO_PROJECT(
      projectId,
      developerId
    )}`;
    console.log("POST assignDeveloper URL:", url);
    console.log("projectId:", projectId, "developerId:", developerId);

    const res = await fetch(url, {
      method: "POST",
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error assignDeveloper:", res.status, res.statusText, text);
      throw new Error(`Error al asignar desarrollador: ${text}`);
    }
  },

  unassignDeveloper: async (
    projectId: number,
    developerId: number
  ): Promise<void> => {
    const res = await fetch(
      `${API_BASE}${ENDPOINTS.UNASSIGN_DEVELOPER_FROM_PROJECT(
        projectId,
        developerId
      )}`,
      {
        method: "DELETE",
        headers,
      }
    );
    if (!res.ok)
      throw new Error("Error al desasignar desarrollador del proyecto");
  },

  getDevelopers: async (projectId: number) => {
    const res = await fetch(
      `${API_BASE}${ENDPOINTS.PROJECT_DEVELOPERS(projectId)}`,
      { headers }
    );
    if (!res.ok)
      throw new Error("Error al obtener desarrolladores del proyecto");
    return res.json();
  },
};

export default projectsApi;
