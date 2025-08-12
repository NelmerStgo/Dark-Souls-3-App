// Hook para manejar:
// - Carga de ítems y cálculo de progreso global
// - Filtro actual
// - Reset de progreso
import { useState, useCallback } from 'react';
import { obtenerVersionesItem, resetearTodoProgreso } from '../services/progresoItemsStorage';

// Función auxiliar: determina si un ítem pasa el filtro
function coincideFiltro(item, filtro) {
    if (filtro === 'all') return true;
    return item.estadoDeProgreso === filtro;
}

export function useProgresoItems(dataSource = []) {
    const [items, setItems] = useState([]);
    const [progreso, setProgreso] = useState({ completed: 0, total: 0 });
    const [filtro, setFiltro] = useState('all');
    const [cargando, setCargando] = useState(true);

    const cargarItems = useCallback(async () => {
        setCargando(true);
        try {
            let completadosGlobal = 0;
            let totalGlobal = 0;

            const nuevos = await Promise.all(
                dataSource.map(async item => {
                    const versiones = await obtenerVersionesItem(item.nombre, item.versiones);
                    totalGlobal += versiones.length;
                    let comp = 0;
                    versiones.forEach(v => {
                        if (v.conseguido) comp++;
                    });
                    completadosGlobal += comp;

                    let estadoDeProgreso = 'noIniciado';
                    if (comp > 0 && comp < versiones.length) estadoDeProgreso = 'enProgreso';
                    else if (comp === versiones.length) estadoDeProgreso = 'completado';

                    return {
                        ...item,
                        versiones,
                        estadoDeProgreso
                    };
                })
            );

            setItems(nuevos);
            setProgreso({ completed: completadosGlobal, total: totalGlobal });
        } catch (e) {
            console.error('cargarItems error:', e);
        } finally {
            setCargando(false);
        }
    }, [dataSource]);

    const resetearProgreso = useCallback(async () => {
        await resetearTodoProgreso();
        await cargarItems();
    }, [cargarItems]);

    const itemsFiltrados = items.filter(i => coincideFiltro(i, filtro));

    return {
        items,
        itemsFiltrados,
        progreso,
        filtro,
        setFiltro,
        cargando,
        cargarItems,
        resetearProgreso
    };
}