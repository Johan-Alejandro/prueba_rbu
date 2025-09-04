export const ENDPOINTS = {
  TEST_CONNECTION: "/api/test-connection",

  // Desarrolladores
  DEVELOPERS: "/api/desarrolladores",
  DEVELOPER_BY_ID: (id: string | number) => `/api/desarrolladores/${id}`,
  DEVELOPER_REACTIVATE: (id: string | number) =>
    `/api/desarrolladores/${id}/reactivar`,
  DEVELOPER_PROJECTS: (id: string | number) =>
    `/api/desarrolladores/${id}/proyectos`,

  // Proyectos
  PROJECTS: "/api/proyectos",
  PROJECT_BY_ID: (id: string | number) => `/api/proyectos/${id}`,
  PROJECT_REACTIVATE: (id: string | number) => `/api/proyectos/${id}/reactivar`,
  PROJECT_DEVELOPERS: (id: string | number) =>
    `/api/proyectos/${id}/desarrolladores`,

  // Asignaciones
  ASSIGN_DEVELOPER_TO_PROJECT: (
    projectId: string | number,
    developerId: string | number
  ) => `/api/proyectos/${projectId}/desarrolladores/${developerId}`,
  UNASSIGN_DEVELOPER_FROM_PROJECT: (
    projectId: string | number,
    developerId: string | number
  ) => `/api/proyectos/${projectId}/desarrolladores/${developerId}`,
} as const;
