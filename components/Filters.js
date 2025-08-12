// Definición central de filtros para reutilizar en modal o menús
export const FILTER_DEFS = [
  { key: 'all', label: 'Todos', subtitle: 'Muestra todos los ítems', icon: 'layers-outline' },
  { key: 'completado', label: 'Completados', subtitle: 'Todas las versiones conseguidas', icon: 'trophy-outline' },
  { key: 'enProgreso', label: 'En progreso', subtitle: 'Algunas versiones conseguidas', icon: 'hourglass-outline' },
  { key: 'noIniciado', label: 'No iniciados', subtitle: 'Ninguna versión conseguida', icon: 'ellipse-outline' }
];

export const isFilterMatch = (item, filterKey) => {
  if (filterKey === 'all') return true;
  return item.estadoDeProgreso === filterKey;
};