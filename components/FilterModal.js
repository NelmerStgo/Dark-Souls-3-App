// Versión actualizada usando theme colores
import React, { useEffect, useRef, useMemo } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    Animated,
    Easing,
    StyleSheet
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colores } from '../theme/colores';

/**
 * FilterModal.js
 * Componente modal para aplicar filtros a la lista de ítems.
 *
 */
const FilterModal = ({
    visible,
    onClose = () => { },
    filter,
    onChangeFilter,
    onReset = () => { },
    progress = { completed: 0, total: 0 }
}) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 220,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.quad)
                }),
                Animated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 7,
                    tension: 60
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 160,
                    useNativeDriver: true,
                    easing: Easing.in(Easing.quad)
                }),
                Animated.timing(scale, {
                    toValue: 0.9,
                    duration: 160,
                    useNativeDriver: true,
                    easing: Easing.in(Easing.quad)
                })
            ]).start();
        }
    }, [visible, opacity, scale]);

    const filtros = useMemo(
        () => [
            { key: 'all', label: 'Todos', subtitle: 'Muestra todos los ítems', icon: 'layers-outline' },
            { key: 'completado', label: 'Completados', subtitle: 'Todas las versiones conseguidas', icon: 'trophy-outline' },
            { key: 'enProgreso', label: 'En progreso', subtitle: 'Algunas versiones conseguidas', icon: 'hourglass-outline' },
            { key: 'noIniciado', label: 'No iniciados', subtitle: 'Ninguna versión conseguida', icon: 'ellipse-outline' }
        ],
        []
    );

    const seleccionar = (k) => {
        onChangeFilter?.(k);
        onClose?.();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Animated.View style={[estilos.overlay, { opacity }]}>
                <Pressable style={estilos.dismissArea} onPress={onClose} />
                <Animated.View style={[estilos.card, { transform: [{ scale }] }]}>
                    <View style={estilos.headerRow}>
                        <View style={estilos.headerLeft}>
                            <Ionicons name="options" size={20} color={colores.dorado} style={{ marginRight: 6 }} />
                            <Text style={estilos.title}>Filtros</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                            <Ionicons name="close" size={22} color="#B8B8B8" />
                        </TouchableOpacity>
                    </View>

                    <View style={estilos.divider} />

                    <View style={estilos.progressBox}>
                        <Ionicons name="stats-chart" size={18} color={colores.doradoSuave} style={{ marginRight: 8 }} />
                        <Text style={estilos.progressText}>
                            Progreso: {progress.completed} / {progress.total} {"               "}
                            ( {progress.total > 0 ? ((progress.completed / progress.total) * 100).toFixed(1) : '0'}%)
                        </Text>
                    </View>

                    <View style={{ height: 10 }} />

                    <View>
                        {filtros.map(f => {
                            const activo = f.key === filter;
                            return (
                                <TouchableOpacity
                                    key={f.key}
                                    onPress={() => seleccionar(f.key)}
                                    activeOpacity={0.75}
                                    style={[estilos.filterRow, activo && estilos.filterRowActive]}
                                >
                                    <View style={estilos.filterLeft}>
                                        <View style={[estilos.filterIconWrapper, activo && estilos.filterIconWrapperActive]}>
                                            <Ionicons
                                                name={f.icon}
                                                size={18}
                                                color={activo ? colores.textoInverso : colores.doradoSuave}
                                            />
                                        </View>
                                        <View>
                                            <Text style={[estilos.filterLabel, activo && estilos.filterLabelActive]}>{f.label}</Text>
                                            <Text style={estilos.filterSubtitle}>{f.subtitle}</Text>
                                        </View>
                                    </View>
                                    {activo
                                        ? <Ionicons name="checkmark-circle" size={22} color={colores.doradoSuave} />
                                        : <Ionicons name="ellipse-outline" size={20} color={colores.iconoInactivo} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={estilos.divider} />

                    <View style={estilos.actionsRow}>
                        <TouchableOpacity onPress={onReset} style={estilos.resetButton} activeOpacity={0.8}>
                            <Ionicons name="flame" size={16} color={colores.iconoClaro} style={{ marginRight: 6 }} />
                            <Text style={estilos.resetButtonText}>Restablecer {'\n'}progreso</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose} style={estilos.acceptButton} activeOpacity={0.8}>
                            <Ionicons name="checkmark" size={18} color={colores.dorado} style={{ marginRight: 4 }} />
                            <Text style={estilos.acceptButtonText}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const estilos = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colores.overlay,
        justifyContent: 'center',
        paddingHorizontal: 26
    },
    dismissArea: { ...StyleSheet.absoluteFillObject },
    card: {
        backgroundColor: colores.fondoPanel,
        borderRadius: 18,
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 16,
        borderWidth: 1,
        borderColor: colores.bordeSuave,
        shadowColor: colores.sombra,
        shadowOpacity: 0.9,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 24,
        elevation: 12
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    title: { fontSize: 18, color: '#E2D3B0', fontWeight: '600', letterSpacing: 0.8 },
    divider: { height: 1, backgroundColor: '#29231A', marginVertical: 14 },
    progressBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colores.fondoResaltado,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#2D251B'
    },
    progressText: { color: colores.dorado, fontSize: 14, letterSpacing: 0.5 },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#211B12',
        backgroundColor: '#141414'
    },
    filterRowActive: {
        backgroundColor: colores.dorado,
        borderColor: colores.doradoResplandor,
        shadowColor: colores.dorado,
        shadowOpacity: 0.35,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5
    },
    filterLeft: { flexDirection: 'row', alignItems: 'center' },
    filterIconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 8,
        backgroundColor: '#1E1B16',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#2F2619'
    },
    filterIconWrapperActive: {
        backgroundColor: colores.doradoClaro,
        borderColor: colores.doradoContraste
    },
    filterLabel: {
        color: colores.textoPrimario,
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
        letterSpacing: 0.4
    },
    filterLabelActive: { color: colores.textoInverso },
    filterSubtitle: { color: colores.textoSuave, fontSize: 11, letterSpacing: 0.3 },
    actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colores.emberOscuro,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colores.bordePeligro,
        minWidth: '52%'
    },
    resetButtonText: {
        color: colores.iconoClaro,
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.5
    },
    acceptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1D1A15',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colores.bordeLigero,
        minWidth: '44%',
        justifyContent: 'center'
    },
    acceptButtonText: {
        color: colores.dorado,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5
    },
});

export default FilterModal;