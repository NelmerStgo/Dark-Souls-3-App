import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colores } from '../theme/colores';

// Botón que abre el modal de filtros
const BotonFiltroModal = ({ onPress }) => {
    return (
        <TouchableOpacity
            style={styles.boton}
            onPress={onPress}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Abrir filtros"
        >
            <Ionicons name="options" size={18} color={colores.doradoSuave} style={{ marginRight: 8 }} />
            <Text style={styles.texto}>Filtros</Text>
            <Ionicons name="chevron-forward" size={18} color={colores.textoSuave} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    boton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: colores.fondoPanelAlt,
        paddingVertical: 10,
        paddingHorizontal: 22,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colores.bordeLigero,
        marginBottom: 8,
        shadowColor: colores.sombra,
        shadowOpacity: 0.6,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 4
    },
    texto: {
        color: colores.doradoSuave,
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginRight: 4
    }
});

export default React.memo(BotonFiltroModal);