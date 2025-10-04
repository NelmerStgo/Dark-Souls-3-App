import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colores } from '../theme/colores';

// Encabezado con el nombre de la categoría y el resumen de progreso
const ResumenProgreso = ({ titulo, progreso }) => {
    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>{titulo}</Text>
            <Text style={styles.progreso}>
                Progreso:{' '}
                <Text style={styles.text}>{progreso.completed}</Text>{' '}
                de{' '}
                <Text style={styles.text}>{progreso.total}</Text>{' '}
                conseguidos
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    contenedor: {
        marginBottom: 4
    },
    titulo: {
        fontFamily: 'OptimusPrinceps',
        fontSize: 26,
        color: colores.dorado,
        textAlign: 'center',
        marginBottom: 4
    },
    progreso: {
        fontFamily: 'Inter',
        fontSize: 14,
        color: colores.textoSecundario,
        textAlign: 'center',
        marginBottom: 8
    },
    text: {
        color: "#65a30d",
    }
});

export default React.memo(ResumenProgreso);