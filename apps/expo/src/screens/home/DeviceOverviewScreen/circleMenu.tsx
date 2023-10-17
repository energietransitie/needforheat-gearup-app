import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeStackParamList } from "@/types/navigation";

const CircleMenu = () => {
    const [showSubMenu, setShowSubMenu] = useState(false);

    const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu);
    };

    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

    const handleMenuItemClick = (itemLabel: string) => {

        if (itemLabel === 'Add Device') {
            navigation.navigate('HomeScreen');
        } else if (itemLabel === 'Add EneLogic') {
            navigation.navigate('AddOnlineDataSourceScreen');
        }
    };

    return (
        <View style={styles.container}>
            {showSubMenu && (
                <View style={styles.subMenu}>
                    <TouchableOpacity onPress={() => handleMenuItemClick('Add Device')}>
                        <MenuItem icon="add-outline" label="Add Device" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleMenuItemClick('Add EneLogic')}>
                        <MenuItem icon="add-outline" label="Add EneLogic" />
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity onPress={toggleSubMenu}>
                <View
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: '#45B97C',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {showSubMenu ? (
                        <Text style={{ color: 'white', fontSize: 30 }}>X</Text>
                    ) : (
                        <Text style={{ color: 'white', fontSize: 30 }}>+</Text>
                    )}
                </View>
            </TouchableOpacity>
        </View >
    );
};

const MenuItem = ({ icon, label }: { icon: string; label: string }) => (
    <View style={styles.menuItem}>
        <Icon name={icon} size={30} color="green" />
        <Text>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    subMenu: {
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 10,
    },
    menuItem: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#97D4B5',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
});

export default CircleMenu;