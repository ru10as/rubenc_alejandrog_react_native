import React from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { List, Text, Button, Divider, Avatar, IconButton, Surface } from 'react-native-paper';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { colorTiendaOscuro } from '../../comun/comun';

const mapStateToProps = (state) => ({
    items: state.carrito.items,
    usuario: state.usuario?.user,
});

const CarritoComponent = ({ items, usuario, dispatch, navigation }) => {
    const { t } = useTranslation();

    // Cálculo del importe total
    const total = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    const quitarProducto = (id, talla) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id, talla } });
    };

    const vaciarCarrito = () => {
        Alert.alert(
            t('carrito_vaciar_titulo', 'Vaciar carrito'),
            t('carrito_vaciar_msg', '¿Seguro que quieres quitar todos los productos?'),
            [
                { text: t('cancelar', 'Cancelar'), style: 'cancel' },
                { text: t('vaciar', 'Vaciar'), onPress: () => dispatch({ type: 'CLEAN_CART' }), style: 'destructive' }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <Surface style={styles.itemCard} elevation={1}>
            <List.Item
                title={item.nombre}
                titleStyle={styles.productoTitulo}
                description={`${t('talla', 'Talla')}: ${item.talla} | ${t('cantidad', 'Cant')}: ${item.cantidad}\n${(item.precio * item.cantidad).toFixed(2)}€`}
                descriptionStyle={styles.productoDesc}
                left={() => (
                    <Avatar.Image 
                        size={60} 
                        source={{ uri: item.imagen }} 
                        style={styles.avatar} 
                    />
                )}
                right={() => (
                    <IconButton 
                        icon="delete-outline" 
                        iconColor="#d32f2f" 
                        onPress={() => quitarProducto(item.id, item.talla)} 
                    />
                )}
            />
        </Surface>
    );

    return (
        <View style={styles.container}>
            {items.length > 0 ? (
                <>
                    {/* Lista de productos */}
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id + item.talla}
                        contentContainerStyle={styles.listContent}
                    />

                    {/* Resumen y Boton de Pago */}
                    <Surface style={styles.footer} elevation={4}>
                        <View style={styles.totalRow}>
                            <Text variant="titleMedium">{t('total', 'Total')}:</Text>
                            <Text variant="headlineSmall" style={styles.precioTotal}>{total.toFixed(2)}€</Text>
                        </View>
                        
                        <Button 
                            mode="contained" 
                            buttonColor={colorTiendaOscuro}
                            style={styles.botonPago}
                            onPress={() => usuario ? navigation.navigate('Pasarela') : navigation.navigate('Configuracion')}
                        >
                            {usuario ? t('finalizar_compra', 'Finalizar Pedido') : t('login_para_pagar', 'Inicia sesión para pagar')}
                        </Button>
                        
                        <Button mode="text" onPress={vaciarCarrito} textColor="#777">
                            {t('vaciar_carrito', 'Vaciar Carrito')}
                        </Button>
                    </Surface>
                </>
            ) : (
                <View style={styles.vacioContainer}>
                    <IconButton icon="cart-off" size={80} iconColor="#ccc" />
                    <Text variant="headlineSmall" style={styles.vacioTexto}>
                        {t('carrito_vacio_titulo', 'Tu carrito está vacío')}
                    </Text>
                    <Text style={styles.vacioSubtexto}>
                        {t('carrito_vacio_msg', '¡Añade alguna camiseta de tu equipo!')}
                    </Text>
                    <Button 
                        mode="outlined" 
                        onPress={() => navigation.navigate('Camisetas')}
                        style={styles.botonVolver}
                    >
                        {t('ir_a_tienda', 'Ir a la tienda')}
                    </Button>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    listContent: { padding: 10 },
    itemCard: { marginBottom: 10, borderRadius: 8, backgroundColor: '#fff', overflow: 'hidden' },
    productoTitulo: { fontWeight: 'bold' },
    productoDesc: { color: '#666' },
    avatar: { backgroundColor: '#fff' },
    footer: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#fff' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    precioTotal: { fontWeight: 'bold', color: colorTiendaOscuro },
    botonPago: { paddingVertical: 4, marginBottom: 5 },
    vacioContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    vacioTexto: { color: '#555', marginBottom: 10 },
    vacioSubtexto: { color: '#999', textAlign: 'center', marginBottom: 20 },
    botonVolver: { marginTop: 10 }
});

export default connect(mapStateToProps)(CarritoComponent);