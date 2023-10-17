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

    return (
        <View style={styles.container}>
            {showSubMenu && (
                <View style={styles.subMenu}>
                    <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                        <MenuItem icon="qr-code-outline" iconText='Scan QR Code' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('AddOnlineDataSourceScreen')}>
                        <MenuItem icon="link-outline" iconText='Enelogic toevoegen' />
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity onPress={toggleSubMenu}
            style={{ 
                display: 'flex',
                alignItems: 'flex-end'
             }}>
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
                        <Icon name="close-outline" size={50} color="white" />
                    ) : (
                        <Icon name="add-outline" size={50} color="white" />
                    )}
                </View>
            </TouchableOpacity>
        </View >
    );
};

const MenuItem = ({ icon, iconText }: { icon: string, iconText: string}) => (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Text style={{ color: 'black', width: '45%', textAlign: 'right', marginRight: '5%' }}>{iconText}</Text>
        <View style={styles.menuItem}>
            <Icon name={icon} size={30} color="white" />
        </View>
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
        alignItems: 'flex-end',
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