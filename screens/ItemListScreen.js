import React, { useCallback, useEffect, useRef, useState } from 'react';
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

// Data
import ringsData from '../data/ringsData_v5.json';
import gesturesData from '../data/gesturesData.json';
import sorceriesData from '../data/sorceriesData.json';
import pyromanciesData from '../data/pyromanciesData.json';
import miraclesData from '../data/miraclesData.json';

// Componentes
import ListItem from '../components/ListItem';
import FilterModal from '../components/FilterModal';
import BotonFiltroModal from '../components/BotonFiltroModal';
import ResumenProgreso from '../components/ResumenProgreso';
import EstadoVacio from '../components/EstadoVacio';
import ScrollToTopButton from '../components/ScrollToTopButton';

// Hooks
import { useProgresoItems } from '../hooks/useProgresoItems';
import { colores } from '../theme/colores';

// Fuentes de datos por categoría
const dataSources = {
  rings: ringsData.anillos,
  gestures: gesturesData.gestures,
  sorceries: sorceriesData.sorceries,
  pyromancies: pyromanciesData.pyromancies,
  miracles: miraclesData.miracles
};

const ITEM_HEIGHT = 84; // Altura del item (74) + marginBottom (10)

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
    resetearProgreso,
    actualizarUnItem
  } = useProgresoItems(dataSource);

  const [modalVisible, setModalVisible] = useState(false);

  // Refs para restaurar scroll y gestionar estado entre navegaciones
  const scrollPositionRef = useRef(0);
  const flatListRef = useRef(null);
  const cargadoInicialRef = useRef(false);
  const volviendoRef = useRef(false);

  // Estado que controla la visibilidad del botón flotante "Ir arriba"
  const mostrarIrArribaRef = useRef(false); // estado lógico fuera de React para evitar renders en cada scroll
  const [mostrarIrArriba, setMostrarIrArriba] = useState(false);
  

  const manejarVisibilidadFab = (offsetY) => {
    const umbral = 400;
    const debeMostrar = offsetY > umbral;
    if (debeMostrar !== mostrarIrArribaRef.current) {
      mostrarIrArribaRef.current = debeMostrar;
      setMostrarIrArriba(debeMostrar);
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

  // Actualizacion del item
  const handleItemPress = useCallback(
    (item, index) => {
      navigation.navigate('ItemDetail', {
        itemDetails: item,
        categoryId: categoryId,
        // actualiza SOLO el ítem modificado
        onUpdateItem: (updatedItem) => {
          actualizarUnItem(index, updatedItem);
        }
      });
    },
    [navigation, actualizarUnItem, categoryId]
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

  // item render
  const renderItem = useCallback(
    ({ item, index }) => (
      <ListItem
        item={item}
        onPress={() => handleItemPress(item, index)}
        mostrarVersiones={true} // true/false para mostrar/ocultar el badge dentro de la lista
        categoryId={categoryId}
      />
    ),
    [handleItemPress, categoryId]
  );

  // Optimización FlatList
  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
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

        getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={11}
        
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
        <ScrollToTopButton
          visible={mostrarIrArriba}
          onPress={() => {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
          }}
        />
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
  }
});

export default ItemListScreen;