import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import HomeScreen from '../screens/HomeScreen';
import ItemListScreen from '../screens/ItemListScreen';
import ItemDetailScreen from '../screens/ItemDetailScreen';
import AcercaDeScreen from '../screens/AcercaDeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar style="light" backgroundColor="#000000" />

                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#0D0D0D',
                        },
                        headerTintColor: '#D4D4D4',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        cardStyle: {
                            backgroundColor: '#1E1E1E',
                        },
                    }}      
                    >
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            title: 'Dark Souls 3 App',
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="ItemList"
                        component={ItemListScreen}
                        options={({ route }) => ({
                            title: route.params.categoryName,
                            headerShown: false,
                            presentation: 'card',
                        })}
                    />
                    <Stack.Screen
                        name="ItemDetail"
                        component={ItemDetailScreen}
                        options={({ route }) => ({
                            title: route.params.itemName,
                            headerShown: false,
                        })}
                    />
                    <Stack.Screen
                        name="Acerca de"
                        component={AcercaDeScreen}
                        options={() => ({
                            headerShown: false,
                        })}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

export default AppNavigator;