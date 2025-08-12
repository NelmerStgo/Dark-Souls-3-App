import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import images from '../assets/images/imageRingsMap';
import { colores } from '../theme/colores';

/* =========================================================
   Componente visual de una versión
   ========================================================= */
const VersionItem = ({ version, index, onToggle }) => {
  const fade = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // animación sutil al pulsar
    Animated.sequence([
      Animated.timing(fade, { toValue: 0.3, duration: 90, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 120, useNativeDriver: true })
    ]).start();
    onToggle();
  };

  const iconData = version.conseguido
    ? { name: 'checkmark-circle', color: colores.dorado }
    : { name: 'ellipse-outline', color: colores.iconoInactivo };

  return (
    <Animated.View style={[styles.versionCard, { opacity: fade }]}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.versionInner,
          pressed && styles.versionPressed
        ]}
        android_ripple={{ color: '#2A241C' }}
      >
        <View style={styles.versionIconWrapper}>
          <Ionicons name={iconData.name} size={26} color={iconData.color} />
        </View>
        <View style={styles.versionContent}>
          <Text style={styles.versionTitle}>
            Nivel: <Text style={styles.versionTitleValue}>{version.nivel || 'Estándar'}</Text>
          </Text>
          <Text style={styles.versionMeta}>
            Ubicación: <Text style={styles.versionMetaValue}>{version.ubicacion}</Text>
          </Text>

          {version.otros_detalles && (
            <View style={styles.extraContainer}>
              {Object.entries(version.otros_detalles).map(([k, v]) => (
                <Text key={k} style={styles.extraItem}>
                  {capitalizar(k)}: <Text style={styles.extraValue}>{String(v)}</Text>
                </Text>
              ))}
            </View>
          )}
        </View>

        <Pressable
          onPress={handlePress}
          hitSlop={12}
          style={({ pressed }) => [
            styles.checkTouch,
            pressed && { opacity: 0.6 }
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Marcar versión ${index + 1} como ${version.conseguido ? 'no conseguida' : 'conseguida'}`}
        >
          <Ionicons
            name={version.conseguido ? 'checkbox' : 'square-outline'}
            size={24}
            color={version.conseguido ? colores.dorado : colores.textoSuave}
          />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
};

/* =========================================================
   Pantalla de detalle del ítem
   ========================================================= */
const ItemDetailScreen = ({ route }) => {
  const { itemDetails } = route.params;

  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const total = versions.length;
  const conseguidas = useMemo(
    () => versions.filter(v => v.conseguido).length,
    [versions]
  );

  const progreso = total > 0 ? (conseguidas / total) : 0;

  // Animaciones imagen modal
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.92)).current;

  const abrirModalImagen = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(modalOpacity, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(modalScale, { toValue: 1, useNativeDriver: true, friction: 7, tension: 60 })
    ]).start();
  };

  const cerrarModalImagen = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, { toValue: 0, duration: 140, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(modalScale, { toValue: 0.92, duration: 140, easing: Easing.in(Easing.quad), useNativeDriver: true })
    ]).start(({ finished }) => {
      if (finished) setModalVisible(false);
    });
  };

  // Guardar progreso
  const saveVersions = async (updatedVersions) => {
    try {
      await AsyncStorage.setItem(
        `@item_${itemDetails.nombre}_progress`,
        JSON.stringify(updatedVersions)
      );
    } catch (e) {
      console.error('Error al guardar el progreso del item: ', e);
    }
  };

  // Cargar progreso
  const loadVersions = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(`@item_${itemDetails.nombre}_progress`);
      if (jsonValue !== null) {
        setVersions(JSON.parse(jsonValue));
      } else {
        const initialVersions = itemDetails.versiones.map(v => ({
          ...v,
            conseguido: false
        }));
        setVersions(initialVersions);
      }
    } catch (e) {
      console.error('Error al cargar el progreso del item: ', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVersion = (index) => {
    setVersions(prev => {
      const updated = prev.map((v, i) =>
        i === index ? { ...v, conseguido: !v.conseguido } : v
      );
      saveVersions(updated);
      return updated;
    });
  };

  const toggleTodas = () => {
    const todasMarcadas = conseguidas === total && total > 0;
    const updated = versions.map(v => ({ ...v, conseguido: !todasMarcadas }));
    setVersions(updated);
    saveVersions(updated);
  };

  useEffect(() => {
    loadVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemDetails.nombre]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colores.dorado} />
      </View>
    );
  }

  const imageSource = images?.[itemDetails?.imagen] || null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.itemName}>{itemDetails.nombre}</Text>
          <Text style={styles.itemSubtitle}>Registro del códice</Text>
        </View>

        {/* Imagen principal */}
        {imageSource && (
          <Pressable
            onPress={abrirModalImagen}
            style={({ pressed }) => [
              styles.imageWrapper,
              pressed && styles.imagePressed
            ]}
          >
            <Image source={imageSource} style={styles.itemImage} />
            <View style={styles.imageOverlayLabel}>
              <Ionicons name="expand" size={14} color={colores.doradoClaro} />
              <Text style={styles.imageOverlayText}>Ampliar</Text>
            </View>
          </Pressable>
        )}

        {/* Descripción */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Descripcion</Text>
          <View style={styles.panelDivider} />
          <Text style={styles.descriptionText}>{itemDetails.descripcion}</Text>
        </View>

        {/* Progreso de versiones */}
        <View style={styles.progressPanel}>
            <View style={styles.progressHeaderRow}>
              <Text style={styles.versionsTitle}>Versiones</Text>
              {total > 0 && (
                <Pressable
                  onPress={toggleTodas}
                  style={({ pressed }) => [
                    styles.toggleAllBtn,
                    pressed && { opacity: 0.7 }
                  ]}
                >
                  <Ionicons
                    name={conseguidas === total && total > 0 ? 'checkmark-done' : 'checkbox'}
                    size={16}
                    color={colores.doradoSuave}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.toggleAllText}>
                    {conseguidas === total && total > 0 ? 'Desmarcar todas' : 'Marcar todas'}
                  </Text>
                </Pressable>
              )}
            </View>

            {total > 0 && (
              <>
                <View style={styles.progressBarOuter}>
                  <View style={[styles.progressBarInner, { width: `${progreso * 100}%` }]} />
                </View>
                <Text style={styles.progressStats}>
                  {conseguidas} / {total} conseguidas
                </Text>
              </>
            )}
        </View>

        {/* Lista de versiones */}
        {versions.map((version, idx) => (
          <VersionItem
            key={idx.toString()}
            version={version}
            index={idx}
            onToggle={() => handleToggleVersion(idx)}
          />
        ))}

        {versions.length === 0 && (
          <View style={styles.emptyVersions}>
            <Ionicons name="information-circle-outline" size={32} color={colores.textoMuted} />
            <Text style={styles.emptyVersionsText}>Este ítem no posee versiones registradas.</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal imagen ampliada */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={cerrarModalImagen}
      >
        <TouchableWithoutFeedback onPress={cerrarModalImagen}>
          <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
            <Animated.View
              style={[
                styles.modalImageContainer,
                { transform: [{ scale: modalScale }] }
              ]}
            >
              {imageSource && (
                <Image
                  source={imageSource}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              )}
              <View style={styles.closeBadge}>
                <Ionicons name="close" size={20} color={colores.textoInverso} />
              </View>
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

/* =========================================================
   Helpers
   ========================================================= */
function capitalizar(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* =========================================================
   Estilos
   ========================================================= */
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colores.fondoBase
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 60
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colores.fondoBase,
    justifyContent: 'center',
    alignItems: 'center'
  },

  /* Header */
  header: {
    alignItems: 'center',
    marginBottom: 16
  },
  itemName: {
    fontFamily: 'OptimusPrinceps',
    color: colores.dorado,
    fontSize: 30,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 4
  },
  itemSubtitle: {
    fontSize: 12,
    color: colores.textoSuave,
    letterSpacing: 2,
    textTransform: 'uppercase'
  },

  /* Imagen principal */
  imageWrapper: {
    alignSelf: 'center',
    width: '100%',
    aspectRatio: 1,
    maxWidth: 320,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colores.bordeSuave,
    backgroundColor: '#181613',
    marginBottom: 20,
    shadowColor: colores.sombra,
    shadowOpacity: 0.55,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 6,
    position: 'relative',
  },
  imagePressed: {
    opacity: 0.85
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  imageOverlayLabel: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(25,23,20,0.78)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A2F20'
  },
  imageOverlayText: {
    color: colores.doradoClaro,
    fontSize: 11,
    marginLeft: 4,
    letterSpacing: 0.5
  },

  /* Panel descripción */
  panel: {
    backgroundColor: '#151312',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colores.bordeSuave,
    marginBottom: 20
  },
  panelTitle: {
    fontFamily: 'OptimusPrinceps',
    fontSize: 20,
    color: colores.dorado,
    marginBottom: 6,
    letterSpacing: 0.5
  },
  panelDivider: {
    height: 2,
    width: 62,
    backgroundColor: '#3A2F20',
    borderRadius: 2,
    marginBottom: 10
  },
  descriptionText: {
    color: colores.textoSecundario,
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.3
  },

  /* Progreso de versiones */
  progressPanel: {
    marginBottom: 14
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  versionsTitle: {
    fontFamily: 'OptimusPrinceps',
    fontSize: 22,
    color: colores.dorado,
    letterSpacing: 0.5
  },
  toggleAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1A17',
    borderWidth: 1,
    borderColor: '#3A2F20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10
  },
  toggleAllText: {
    color: colores.doradoSuave,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  progressBarOuter: {
    height: 10,
    borderRadius: 6,
    backgroundColor: '#1E1C1A',
    borderWidth: 1,
    borderColor: '#2F2418',
    overflow: 'hidden'
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: colores.dorado,
    borderRadius: 6
  },
  progressStats: {
    marginTop: 6,
    fontSize: 12,
    color: colores.textoSuave,
    letterSpacing: 0.4
  },

  /* Version card */
  versionCard: {
    backgroundColor: '#151312',
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2A2117',
    overflow: 'hidden'
  },
  versionInner: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'flex-start'
  },
  versionPressed: {
    backgroundColor: '#1C1814'
  },
  versionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1F1B16',
    borderWidth: 1,
    borderColor: '#342819',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  versionContent: {
    flex: 1
  },
  versionTitle: {
    color: colores.textoPrimario,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginBottom: 2
  },
  versionTitleValue: {
    fontWeight: '400',
    color: colores.doradoClaro
  },
  versionMeta: {
    color: colores.textoSuave,
    fontSize: 12,
    letterSpacing: 0.3
  },
  versionMetaValue: {
    color: colores.textoPrimario
  },
  extraContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2A231B'
  },
  extraItem: {
    fontSize: 12,
    color: colores.textoSuave,
    lineHeight: 18,
    marginBottom: 2
  },
  extraValue: {
    color: colores.textoPrimario
  },
  checkTouch: {
    marginLeft: 10,
    padding: 4
  },

  /* Vacío */
  emptyVersions: {
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyVersionsText: {
    marginTop: 10,
    fontSize: 13,
    color: colores.textoMuted,
    letterSpacing: 0.4
  },

  /* Modal imagen */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5,5,5,0.9)',
    justifyContent: 'center',
    padding: 14
  },
  modalImageContainer: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3A2F20',
    backgroundColor: '#0F0F0F',
    position: 'relative'
  },
  fullScreenImage: {
    width: '100%',
    height: '100%'
  },
  closeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(201,164,108,0.85)',
    padding: 8,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#694F29'
  }
});

export default ItemDetailScreen;