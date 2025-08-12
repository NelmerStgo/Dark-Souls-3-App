import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* 
@Categorias correspondientes
*/
const categories = [
    { id: 'rings', name: 'Master of Rings' },
    { id: 'gestures', name: 'Master of Expression' },
    { id: 'sorceries', name: 'Master of Sorceries' },
    { id: 'pyromancies', name: 'Master of Pyromancies' },
    { id: 'miracles', name: 'Master of Miracles' },
    { id: 'about', name: 'Acerca de' },
];

const HomeScreen = ({ navigation }) => {

    // Función para manejar la navegación cuando se presiona una categoría
    const handleCategoryPress = (category) => {
        if (category.id === 'about') {
            navigation.navigate('Acerca de');
        } else {
            navigation.navigate('ItemList', { categoryName: category.name, categoryId: category.id });
        }
    };

    // Componente para renderizar cada item del menú
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleCategoryPress(item)}
        >
            <Text style={styles.menuItemText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Image
                    source={require('../assets/homeImg/DS-title_white.png')}
                    style={styles.image}
                    resizeMode="cover"
                />

                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />

                <Image
                    source={require('../assets/homeImg/Bonfire.gif')}
                    style={styles.imageBonfire}
                    resizeMode="contain"
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000'
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    image: {
        width: '100%',
        height: 50,
        marginTop: '20%',
    },
    imageBonfire: {
        width: 60,
        height: 60,
        alignSelf: 'center',
        marginBottom: 10
    },
    listContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonInnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    menuItem: {
        // Botones del menú
        marginBottom: 20,
        alignItems: 'center',
    },
    menuItemText: {
        // Texto de los botones del menú
        color: '#D4D4D4',
        fontSize: 20,
        fontFamily: 'OptimusPrinceps',
    }
});

export default HomeScreen;