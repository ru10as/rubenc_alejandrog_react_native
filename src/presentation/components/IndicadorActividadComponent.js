import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colorTiendaOscuro } from '../../comun/comun';

export const IndicadorActividad = () => {
    const { t } = useTranslation();

    return (
        <View style={styles.indicadorView}>
            <ActivityIndicator size="large" color={colorTiendaOscuro} />
            <Text style={styles.indicadorText}>
                {t('IndicadorActividad.indicador_proceso')}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    indicadorView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: 20, 
    },
    indicadorText: {
        color: colorTiendaOscuro,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
    },
});