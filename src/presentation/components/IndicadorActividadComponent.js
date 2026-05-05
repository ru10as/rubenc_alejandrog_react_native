import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colorTiendaOscuro } from '../../comun/comun';

export const IndicadorActividad = () => {
    return (
        <View style={styles.indicadorView}>
            <ActivityIndicator size="large" color={colorTiendaOscuro} />
            <Text style={styles.indicadorText}>En proceso . . .</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    indicadorView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    indicadorText: {
        color: colorTiendaOscuro,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
