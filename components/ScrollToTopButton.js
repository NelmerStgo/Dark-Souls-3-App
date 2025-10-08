// components/ScrollToTopButton.js
// con animacion/gemini

import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Animated, Easing } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colores } from '../theme/colores';

const ScrollToTopButton = ({ visible, onPress }) => {
    const fabAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [render, setRender] = useState(visible);

    useEffect(() => {
        if (visible) {
            setRender(true); // aseguramos que está montado
            Animated.timing(fabAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fabAnim, {
                toValue: 0,
                duration: 1000,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) setRender(false); // desmontamos solo al terminar
            });
        }

        // Detenemos cualquier animación de pulso anterior para evitar solapamientos
        pulseAnim.stopAnimation();

        if (visible) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05, // efecto "brasa"
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [visible, fabAnim, pulseAnim]);

    // Combinamos los estilos animados
    const animatedWrapperStyle = {
        opacity: fabAnim,
        transform: [
            {
                scale: pulseAnim.interpolate({
                    inputRange: [1, 1.05],
                    outputRange: [1, 1.03], // El botón crece un poco
                }),
            },
        ],
        shadowOpacity: pulseAnim.interpolate({
            inputRange: [1, 1.05],
            outputRange: [1, 1.05], // La sombra se hace más intensa
        }),
    };

    // Ahora controlamos con `render`, no con `visible`
    if (!render) return null;

    return (
        <Animated.View style={styles.fabContainer}>
            <Animated.View style={[styles.fab, animatedWrapperStyle]}>
                <Pressable
                    onPress={onPress}
                    style={styles.pressable}
                    accessibilityRole="button"
                    accessibilityLabel="Ir al inicio de la lista"
                >
                    <Ionicons name="arrow-up" size={24} color="black" />
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    fabContainer: {
        position: 'absolute',
        right: 18,
        bottom: 24,
    },
    fab: {
        backgroundColor: colores.dorado,
        width: 45,
        height: 45,
        borderRadius: 28,
        shadowColor: '#FFC300',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 8,
    },
    pressable: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ScrollToTopButton;
