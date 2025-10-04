import React, { memo, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colores } from '../theme/colores';

// Img Mapeadas
import imagesRings from '../assets/images/imgMap/imageRingsMap';
import imagesGestures from '../assets/images/imgMap/imageGesturesMap';
import imagesSorceries from '../assets/images/imgMap/imageSorceriesMap';
import imagesPyromancies from '../assets/images/imgMap/imagePyromanciesMap';
import imagesMiracles from '../assets/images/imgMap/imageMiraclesMap';

/**
 * ListItem
 * Props:
 *  - item: { nombre, imagen, estadoDeProgreso, versiones: [{ conseguido: bool, ... }] }
 *  - onPress: function(item)
 *  - mostrarVersiones (opcional) => si quieres ocultar el badge de progreso
 */
const ListItem = ({ item, onPress, mostrarVersiones = true, categoryId }) => {

    // Determinar icono según estado
    const { iconName, iconColor } = useMemo(() => {
        switch (item.estadoDeProgreso) {
            case 'completado':
                return { iconName: 'checkmark-circle', iconColor: colores.dorado };
            case 'enProgreso':
                return { iconName: 'hourglass-outline', iconColor: colores.doradoSuave };
            case 'noIniciado':
            default:
                return { iconName: 'ellipse-outline', iconColor: colores.iconoInactivo };
        }
    }, [item.estadoDeProgreso]);


    const imageMaps = {
        anillos: imagesRings,
        gestures: imagesGestures,
        sorceries: imagesSorceries,
        pyromancies: imagesPyromancies,
        miracles: imagesMiracles
    };

    // Imagen
    const imageMap = imageMaps[categoryId] || imagesRings; // Usa 'rings' como fallback
    const imageSource = imageMap?.[item.imagen] || null;
    const versionesTotales = item.versiones?.length || 0;
    const versionesCompletadas = item.versiones
        ? item.versiones.filter(v => v.conseguido).length
        : 0;

    // Clase dinámica para borde / fondo según estado
    const estadoStyles = useMemo(() => {
        if (item.estadoDeProgreso === 'completado') return styles.cardCompletado;
        if (item.estadoDeProgreso === 'enProgreso') return styles.cardEnProgreso;
        return null;
    }, [item.estadoDeProgreso]);

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Ítem ${item.nombre}, estado ${item.estadoDeProgreso}`}
            onPress={() => onPress(item)}
            style={({ pressed }) => [
                styles.container,
                estadoStyles,
                pressed && styles.pressed
            ]}
        >
            <View style={styles.leftContent}>
                <View style={styles.imageWrapper}>
                    {imageSource ? (
                        <Image
                            source={imageSource}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.placeholder}>
                            <Ionicons name="help" size={20} color={colores.textoSuave} />
                        </View>
                    )}
                </View>

                <View style={styles.textBlock}>
                    <Text numberOfLines={1} style={styles.name}>
                        {item.nombre}
                    </Text>

                    {mostrarVersiones && versionesTotales > 0 && (
                        <View style={styles.badgeRow}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {versionesCompletadas} / {versionesTotales}
                                </Text>
                            </View>
                            {item.estadoDeProgreso === 'enProgreso' && (
                                <Text style={styles.subEstado}>En progreso...</Text>
                            )}
                            {item.estadoDeProgreso === 'completado' && (
                                <Text style={styles.subEstadoCompletado}>¡Completado!</Text>
                            )}
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.iconContainer}>
                <Ionicons
                    name={iconName}
                    size={24}
                    color={iconColor}
                />
            </View>
        </Pressable>
    );
};

/**
 * Comparador para evitar renders innecesarios.
 * Compara campos relevantes:
 *  - nombre
 *  - estadoDeProgreso
 *  - conteo de versiones totales
 *  - conteo de versiones completadas
 */
const areEqual = (prevProps, nextProps) => {
    const prev = prevProps.item;
    const next = nextProps.item;

    if (prev.nombre !== next.nombre) return false;
    if (prev.estadoDeProgreso !== next.estadoDeProgreso) return false;
    if (prevProps.categoryId !== nextProps.categoryId) return false;

    const prevTot = prev.versiones?.length || 0;
    const nextTot = next.versiones?.length || 0;
    if (prevTot !== nextTot) return false;

    const prevComp = prev.versiones
        ? prev.versiones.filter(v => v.conseguido).length
        : 0;
    const nextComp = next.versiones
        ? next.versiones.filter(v => v.conseguido).length
        : 0;
    if (prevComp !== nextComp) return false;

    // mostrarVersiones y onPress se asume estables (padre usa useCallback y no cambia flag)
    if (prevProps.mostrarVersiones !== nextProps.mostrarVersiones) return false;

    return true;
};

export default memo(ListItem, areEqual);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#141414',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#211B12',
        shadowColor: colores.sombra,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }]
    },
    cardCompletado: {
        borderColor: colores.dorado,
        backgroundColor: '#1E1A15'
    },
    cardEnProgreso: {
        borderColor: '#463B20'
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    imageWrapper: {
        width: 48,
        height: 48,
        marginRight: 12,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2F2619',
        backgroundColor: '#23201A',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    placeholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textBlock: {
        flex: 1
    },
    name: {
        color: colores.textoPrimario,
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.4,
        marginBottom: 4
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    badge: {
        backgroundColor: '#1F1B16',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#2E2519'
    },
    badgeText: {
        color: colores.textoSuave,
        fontSize: 11,
        letterSpacing: 0.3
    },
    subEstado: {
        fontSize: 11,
        color: colores.doradoSuave,
        letterSpacing: 0.3,
        marginRight: 8
    },
    subEstadoCompletado: {
        fontSize: 11,
        color: colores.dorado,
        letterSpacing: 0.3
    },
    iconContainer: {
        paddingLeft: 10
    }
});