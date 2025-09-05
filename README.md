# Sistema de Gestión de Desarrolladores y Proyectos

Aplicación web para gestionar desarrolladores y proyectos con asignaciones many-to-many, construida con React + TypeScript.

## Tecnologías

### Obligatorias
- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Bundler y servidor de desarrollo
- **TailwindCSS** - Framework CSS
- **ShadCN/UI** - Componentes de UI
- **React Router DOM** - Enrutamiento

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## Configuración

### Variables de Entorno

Crear archivo `.env.local`:

```env
VITE_API_URL=https://apipruebas3.rbu.cl
VITE_AUTH_TOKEN=tu_token_aqui
```

### API Integration

La aplicación se conecta a:
- **Base URL**: https://apipruebas3.rbu.cl
- **Autenticación**: Bearer token en header `Authorization`
