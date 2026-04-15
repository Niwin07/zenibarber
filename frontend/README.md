# Zenibarber - Frontend

Aplicación de gestión para barberías. Frontend construido con React, Vite y React Query.

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con la URL del API
VITE_API_URL=http://localhost:4000/api/v1
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

## Build

```bash
# Build para producción
npm run build

# Previsualizar build
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── Common/       # Componentes base (Button, Input, Card, etc.)
│   ├── Agenda/       # Componentes de la agenda
│   ├── Clientes/     # Componentes de clientes
│   └── Layout/       # Layout principal
├── views/            # Vistas/pages
├── hooks/            # Custom hooks
├── stores/           # Estado global (Zustand)
├── services/         # Configuración de API
└── styles/           # Estilos globales
```

## Decisiones Técnicas

- **CSS Modules**: Sistema de estilos basado en módulos CSS para scoped styling sin dependencias externas.
- **React Query**: Gestión de estado del servidor con cache automático.
- **Zustand**: Estado global ligero y simple.
- **dnd-kit**: Librería de drag & drop accesible y modular.
- **Sistema de diseño iOS-inspired**: Bordes redondeados, sombras suaves, tipografía limpia.
