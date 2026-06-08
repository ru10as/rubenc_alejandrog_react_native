import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, Divider, Text, Avatar, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { suscribirseAOfertas } from '../../redux/ActionCreators'; 

const mapStateToProps = state => ({
    usuario: state.usuario?.user,
    misOfertas: state.ofertas.items || []
});

const mapDispatchToProps = dispatch => ({
    suscribirse: (uid) => suscribirseAOfertas(uid, dispatch)
});

const MisOfertasComponent = ({ navigation, usuario, misOfertas, suscribirse }) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (!usuario?.uid) return;
        
        const unsubscribe = suscribirse(usuario.uid); 
        return () => unsubscribe();
    }, [usuario?.uid, suscribirse]);

    const renderItem = ({ item }) => {
        let iconoEstado = 'clock-outline';
        let colorEstado = '#757575';
        
        if (item.estado === 'aceptada') {
            iconoEstado = 'check-circle';
            colorEstado = '#4caf50';
        } else if (item.estado === 'rechazada') {
            iconoEstado = 'close-circle';
            colorEstado = '#f44336';
        }

        return (
            <>
                <List.Item
                    title={item.nombreCamiseta || 'Camiseta'} 
                    description={`Oferta: ${item.monto}€`}
                    left={(props) => <Avatar.Icon {...props} icon="tshirt-crew" size={48} />}
                    right={(props) => (
                        <View style={styles.rightContainer}>
                            <View style={styles.estadoContainer}>
                                <Text style={[styles.estadoTexto, { color: colorEstado }]}>
                                    {item.estado ? t(`estado.${item.estado}`) : t('estado.pendiente')}
                                </Text>
                                <List.Icon {...props} icon={iconoEstado} color={colorEstado} />
                            </View>

                            <IconButton 
                                icon="chat" 
                                iconColor="#2196F3" 
                                size={24} 
                                onPress={() => navigation.navigate('ChatOferta', { oferta: item })} 
                            />
                        </View>
                    )}
                />
                <Divider />
            </>
        );
    };

    return (
        <FlatList
            data={misOfertas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={misOfertas.length === 0 && styles.flexVacio}
            ListEmptyComponent={
                <View style={styles.vacioContainer}>
                    <Text style={styles.vacio}>{t('ofertas.vacio')}</Text>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    flexVacio: { flexGrow: 1 },
    vacioContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
    vacio: { color: '#999', textAlign: 'center' },
    rightContainer: { flexDirection: 'row', alignItems: 'center' },
    estadoContainer: { flexDirection: 'row', alignItems: 'center' },
    estadoTexto: { marginRight: 5, fontSize: 12, fontWeight: 'bold' }
});

export default connect(mapStateToProps, mapDispatchToProps)(MisOfertasComponent);