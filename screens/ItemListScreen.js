import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

import ringsData from '../data/ringsData_v5.json';

import ListItem from '../components/ListItem';
import FilterModal from '../components/FilterModal';
import BotonFiltroModal from '../components/BotonFiltroModal';
import ResumenProgreso from '../components/ResumenProgreso';
import EstadoVacio from '../components/EstadoVacio';

import { useProgresoItems } from '../hooks/useProgresoItems';
import { colores } from '../theme/colores';

// Fuentes de datos por categoría
const dataSources = {
  rings: ringsData.anillos
};

const ItemListScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const dataSource = dataSources[categoryId] || [];

  const {
    itemsFiltrados,
    progreso,
    filtro,
    setFiltro,
    cargando,
    cargarItems,
    resetearProgreso
  } = useProgresoItems(dataSource);

  const [modalVisible, setModalVisible] = useState(false);

  // Refs para restaurar scroll y gestionar estado entre navegaciones
  const scrollPositionRef = useRef(0);
  const flatListRef = useRef(null);
  const cargadoInicialRef = useRef(false);
  const volviendoRef = useRef(false);

  // Mostrar / ocultar botón flotante "Ir arriba"
  const mostrarIrArribaRef = useRef(false); // estado lógico fuera de React para evitar renders en cada scroll
  const [mostrarIrArriba, setMostrarIrArriba] = useState(false);
  const fabAnim = useRef(new Animated.Value(0)).current; // 0 oculto, 1 visible

  const animarFab = (to) => {
    Animated.timing(fabAnim, {
      toValue: to,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true
    }).start();
  };

  const manejarVisibilidadFab = (offsetY) => {
    const umbral = 400;
    const debeMostrar = offsetY > umbral;
    if (debeMostrar !== mostrarIrArribaRef.current) {
      mostrarIrArribaRef.current = debeMostrar;
      setMostrarIrArriba(debeMostrar);
      animarFab(debeMostrar ? 1 : 0);
    }
  };

  // Cargar datos / restaurar scroll SOLO cuando corresponde
  useFocusEffect(
    useCallback(() => {
      let activo = true;

      if (cargadoInicialRef.current) {
        // Ya cargado antes: solo restaurar posición
        volviendoRef.current = true;
        requestAnimationFrame(() => {
          if (
            activo &&
            flatListRef.current &&
            scrollPositionRef.current > 0
          ) {
            flatListRef.current.scrollToOffset({
              offset: scrollPositionRef.current,
              animated: false
            });
          }
        });
      } else {
        // Primera vez
        (async () => {
          await cargarItems();
          if (activo) {
            cargadoInicialRef.current = true;
            volviendoRef.current = false;
          }
        })();
      }

      return () => {
        activo = false;
      };
    }, [cargarItems])
  );

  const handleItemPress = useCallback(
    (item) => {
      navigation.navigate('ItemDetail', {
        itemId: item.nombre,
        itemName: item.nombre,
        itemDetails: item
      });
    },
    [navigation]
  );

  const onScroll = useCallback((e) => {
    const y = e.nativeEvent.contentOffset.y;
    scrollPositionRef.current = y;
    manejarVisibilidadFab(y);
  }, []);

  const confirmarReset = useCallback(() => {
    Alert.alert(
      'Restablecer Progreso',
      `¿Estás seguro de que deseas restablecer el progreso de todos los ítems en ${categoryName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            await resetearProgreso();
          }
        }
      ]
    );
  }, [categoryName, resetearProgreso]);

  const renderItem = useCallback(
    ({ item }) => (
      <ListItem
        item={item}
        onPress={() => handleItemPress(item)}
        mostrarVersiones={false} // puedes poner true si quieres el badge dentro de la lista
      />
    ),
    [handleItemPress]
  );

  const keyExtractor = useCallback(item => item.nombre, []);

  if (cargando) {
    return (
      <SafeAreaView style={estilos.container}>
        <View style={estilos.loadingContainer}>
          <ActivityIndicator size="large" color={colores.dorado} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.container}>
      <ResumenProgreso titulo={categoryName} progreso={progreso} />
      <BotonFiltroModal onPress={() => setModalVisible(true)} />

      <FlatList
        ref={flatListRef}
        data={itemsFiltrados}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={itemsFiltrados.length === 0 && estilos.vacioPadding}
        ListEmptyComponent={<EstadoVacio filtro={filtro} />}
      />

      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        filter={filtro}
        onChangeFilter={val => setFiltro(val)}
        onReset={() => {
          setModalVisible(false);
          confirmarReset();
        }}
        progress={progreso}
      />

      {/* Botón flotante "Ir arriba" */}
      {mostrarIrArriba && (
        <Animated.View
          pointerEvents={mostrarIrArriba ? 'auto' : 'none'}
          style={[
            estilos.fabContainer,
            {
              opacity: fabAnim,
              transform: [
                {
                  scale: fabAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1]
                  })
                }
              ]
            }
          ]}
        >
          <Pressable
            onPress={() => {
              flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            }}
            style={({ pressed }) => [
              estilos.fab,
              pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] }
            ]}
            accessibilityRole="button"
            accessibilityLabel="Ir al inicio de la lista"
          >
            <Ionicons name="arrow-up" size={20} color={colores.textoInverso} />
          </Pressable>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondoBase,
    paddingHorizontal: 10,
    paddingTop: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  vacioPadding: {
    paddingTop: 40,
    paddingBottom: 20
  },
  fabContainer: {
    position: 'absolute',
    right: 18,
    bottom: 24
  },
  fab: {
    backgroundColor: colores.dorado,
    width: 50,
    height: 50,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: colores.bordeSuave
  }
});

export default ItemListScreen;