// Este archivo me permitirá utilizar la tipogrfia

import * as Font from 'expo-font';

export const loadFonts = async () => {
    try {
        await Font.loadAsync({
            'OptimusPrinceps': require('../assets/fonts/OptimusPrinceps.ttf'),
        });
        return true;
    } catch (e) {
        console.error('Error cargando fuentes:', e);
        return false;
    }
};
