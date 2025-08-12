import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colores } from '../theme/colores';

const EstadoVacio = ({ filtro }) => {
    return (
        <View style={styles.contenedor}>
            <Ionicons
                name="eye-off-outline"
                size={50}
                color={colores.bordeLigero}
                style={{ marginBottom: 10 }}
            />
            <Text style={styles.titulo}>Sin resultados</Text>
            <Text style={styles.subtitulo}>
                No hay ítems que coincidan con el filtro "{filtro}".
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    contenedor: {
        paddingVertical: 60,
        alignItems: 'center'
    },
    titulo: {
        color: colores.dorado,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6
    },
    subtitulo: {
        color: colores.textoMuted,
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 32,
        lineHeight: 18
    }
});

export default React.memo(EstadoVacio);