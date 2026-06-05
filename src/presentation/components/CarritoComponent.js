import React from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { List, Text, Button, Avatar, IconButton, Surface } from 'react-native-paper';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { colorTiendaOscuro } from '../../comun/comun';
import { anadirAlCarrito, restarDelCarrito, eliminarDelCarrito, limpiarCarrito } from '../../redux/ActionCreators';

// YA NO FILTRAMOS AQUÍ: Redux ya tiene los items del usuario gracias a cargarCarritoDesdeFirebase
const mapStateToProps = (state) => ({
    items: state.carrito.items || [],
    usuario: state.usuario?.user,
});

const mapDispatchToProps = (dispatch) => ({
    anadirAlCarrito: (camiseta, talla) => dispatch(anadirAlCarrito(camiseta, talla)),
    restarDelCarrito: (id, talla) => dispatch(restarDelCarrito(id, talla)),
    eliminarDelCarrito: (id, talla) => dispatch(eliminarDelCarrito(id, talla)),
    limpiarCarrito: () => dispatch(limpiarCarrito()),
});

const CarritoComponent = ({ items, usuario, navigation, anadirAlCarrito, restarDelCarrito, eliminarDelCarrito, limpiarCarrito }) => {
    const { t } = useTranslation();

    const total = items.reduce((acc, item) => acc + (item.camiseta.precio * item.cantidad), 0);

    const confirmarVaciar = () => {
        Alert.alert(
            t('carritoComponent.carrito_vaciar_titulo'),
            t('carritoComponent.carrito_vaciar_msg'),
            [
                { text: t('carritoComponent.cancelar'), style: 'cancel' },
                { text: t('carritoComponent.vaciar'), onPress: () => limpiarCarrito(), style: 'destructive' }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <Surface style={styles.itemCard} elevation={1}>
            <List.Item
                title={item.camiseta.nombre}
                titleStyle={styles.productoTitulo}
                description={`${t('carritoComponent.talla')}: ${item.talla} | ${item.camiseta.precio}€`}
                left={() => (
                    <Avatar.Image size={60} source={{ uri: item.camiseta.imagen }} style={styles.avatar} />
                )}
                right={() => (
                    <View style={styles.controles}>
                        <IconButton icon="minus" size={20} onPress={() => restarDelCarrito(item.camiseta.id, item.talla)} />
                        <Text style={styles.cantidad}>{item.cantidad}</Text>
                        <IconButton icon="plus" size={20} onPress={() => anadirAlCarrito(item.camiseta, item.talla)} />
                        <IconButton icon="delete-outline" iconColor="#d32f2f" onPress={() => eliminarDelCarrito(item.camiseta.id, item.talla)} />
                    </View>
                )}
            />
        </Surface>
    );

    return (
        <View style={styles.container}>
            {items.length > 0 ? (
                <>
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={(item) => `${item.camiseta.id}-${item.talla}`}
                        contentContainerStyle={styles.listContent}
                    />
                    <Surface style={styles.footer} elevation={4}>
                        <View style={styles.totalRow}>
                            <Text variant="titleMedium">{t('carritoComponent.total')}:</Text>
                            <Text variant="headlineSmall" style={styles.precioTotal}>{total.toFixed(2)}€</Text>
                        </View>
                        <Button 
                            mode="contained" 
                            buttonColor={colorTiendaOscuro}
                            style={styles.botonPago}
                            onPress={() => usuario ? navigation.navigate('Pasarela') : navigation.navigate('Configuracion')}
                        >
                            {usuario ? t('carritoComponent.finalizar_compra') : t('carritoComponent.login_para_pagar')}
                        </Button>
                        <Button mode="text" onPress={confirmarVaciar} textColor="#777">
                            {t('carritoComponent.vaciar_carrito')}
                        </Button>
                    </Surface>
                </>
            ) : (
                <View style={styles.vacioContainer}>
                    <IconButton icon="cart-off" size={80} iconColor="#ccc" />
                    <Text variant="headlineSmall" style={styles.vacioTexto}>{t('carritoComponent.carrito_vacio_titulo')}</Text>
                    <Button mode="outlined" onPress={() => navigation.navigate('Camisetas')} style={styles.botonVolver}>
                        {t('carritoComponent.ir_a_tienda')}
                    </Button>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    listContent: { padding: 10 },
    itemCard: { marginBottom: 10, borderRadius: 8, backgroundColor: '#fff' },
    productoTitulo: { fontWeight: 'bold' },
    controles: { flexDirection: 'row', alignItems: 'center' },
    cantidad: { fontWeight: 'bold', width: 25, textAlign: 'center' },
    footer: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#fff' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    precioTotal: { fontWeight: 'bold', color: colorTiendaOscuro },
    botonPago: { paddingVertical: 4 },
    vacioContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    vacioTexto: { color: '#555', marginBottom: 20 },
    botonVolver: { marginTop: 10 }
});

export default connect(mapStateToProps, mapDispatchToProps)(CarritoComponent);