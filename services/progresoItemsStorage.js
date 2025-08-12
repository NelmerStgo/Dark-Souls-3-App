// Servicio para centralizar el acceso a AsyncStorage relacionado con progreso de ítems.
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIJO = '@item_';

// Obtiene las versiones de un ítem; si no existe en storage, genera fallback con conseguido=false
export async function obtenerVersionesItem(nombre, versionesBase = []) {
  try {
    const json = await AsyncStorage.getItem(`${PREFIJO}${nombre}_progress`);
    if (json) {
      return JSON.parse(json);
    }
    return versionesBase.map(v => ({ ...v, conseguido: false }));
  } catch (e) {
    console.warn('obtenerVersionesItem error:', e);
    return versionesBase.map(v => ({ ...v, conseguido: false }));
  }
}

// Resetea TODO el progreso
export async function resetearTodoProgreso() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const keysFiltradas = keys.filter(k => k.startsWith(PREFIJO));
    if (keysFiltradas.length) {
      await AsyncStorage.multiRemove(keysFiltradas);
    }
  } catch (e) {
    console.warn('resetearTodoProgreso error:', e);
  }
}